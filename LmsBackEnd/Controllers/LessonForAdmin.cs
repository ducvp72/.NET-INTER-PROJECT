
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Drive.v3;
using Google.Apis.Services;
using Google.Apis.Util.Store;
using LmsBackEnd.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LmsBackEnd
{
    [Route("api/[controller]")]
    [ApiController]
    public class LessonForAdmin : ControllerBase
    {
        public readonly ILesson _lesson;
        private readonly IMapper _mapper;
        private readonly LmsContext _context;
        private readonly IUriService uriService;

        public LessonForAdmin(ILesson lesson, IMapper mapper, ICourse course, LmsContext context, IUriService uriService)
        {
            _lesson = lesson;
            _mapper = mapper;
            _context = context;
            this.uriService = uriService;
        }

        //<summary>Tìm tất cả bài học thêm vào slide</summary>
        [HttpGet("AllLesson")]
        public async Task<ActionResult<Response>> GetAllLessonList()
        {
            var less = await _lesson.GetALL();
            if (less == null)
            {
                return BadRequest(new Response { Data = less, Message = "Không có bài học học nào trong hệ thống", Status = 400 });

            }
            return Ok(new Response { Data = less, Message = "Danh sách bài học", Status = 200 });
        }

        ///<summary>Xem danh sách các bài học</summary>
        [HttpGet("LessonList")]
        public async Task<ActionResult<Response>> GetLessonList([FromQuery] FilterPage filter, string lessInfo)
        {
            //var courelist = await _course.GetALL();
            var route = Request.Path.Value;
            var validFilter = new FilterPage(filter.PageNumber, filter.PageSize);
            List<LESSON> less;
            if (lessInfo == null)
            {
                less = await _context.LESSONs
               .Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
               .Take(validFilter.PageSize)
               .ToListAsync();
            }
            else
            {
                less = await _context.LESSONs
                   .Where(c => c.LessonID.Contains(lessInfo) || c.LessonName.Contains(lessInfo))
                   .Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
                   .Take(validFilter.PageSize)
                   .ToListAsync();
            }

            var totalRecords = await _context.LESSONs.CountAsync();
            //var pagedReponse = PaginationHelper.CreatePagedReponse<COURSE>(courses, validFilter, totalRecords, uriService, route);

            if (less == null)
            {
                return BadRequest(new Response { Data = less, Message = "Không có khóa học nào trong hệ thống", Status = 400 });
            }
            var pagedReponse = PaginationHelper.CreatePagedReponse<LESSON>(less, validFilter, totalRecords, uriService, route);
            return Ok(pagedReponse);
        }

        ///<summary>Admin thêm bài học vào khóa học</summary>
        [HttpPost("CreateLessonForAdmin")]
        public async Task<ActionResult<Response>> AddLesson(LessonCreate lesson)
        {

            var checkID = await _lesson.GetLessonID(lesson.LessonID);
            var checkName = await _lesson.GetLessonByName(lesson.LessonName);
            if (checkID != null && checkName != null)
            {
                return BadRequest(new Response { Data = "", Message = "ID Bài học học đã tồn tại", Status = 400 });
            }
            if (checkName != null)
            {
                return BadRequest(new Response { Data = "", Message = "Tên Bài học học đã tồn tại", Status = 400 });
            }
            var less = _mapper.Map<LESSON>(lesson);
            await _lesson.AddLesson(less);
            await _lesson.SaveChange();
            return Ok(new Response { Data = less, Message = "Thêm thành công", Status = 200 });
        }


        ///<summary>Sủa bài học</summary>
        [HttpPut("Update")]
        public async Task<ActionResult<Response>> UpdateLesson(LessonCreate lessonCreate)
        {
            var lessons = await _lesson.GetLessonID(lessonCreate.LessonID);
            if (lessons.LessonID == null)
            {
                return BadRequest(new Response { Data = lessons, Message = "Vui lòng nhập đúng ID để update", Status = 400 });
            }
            _mapper.Map(lessonCreate, lessons);
            await _lesson.SaveChange();
            return Ok(new Response { Data = lessons, Message = "Bài học đã được update", Status = 200 });
        }

        //<summary>Xóa bài học</summary>
        [HttpDelete("DeleteLesson/{lessonID}")]
        public async Task<ActionResult<Response>> Delete(string lessonID)
        {
            var lesson = await _lesson.GetLessonID(lessonID);
            if (lesson.LessonID == null)
            {
                return BadRequest(new Response { Data = lesson, Message = "Không tìm thấy ID để xóa !", Status = 400 });
            }
            await _lesson.DeleteLesson(lesson);
            await _lesson.SaveChange();
            return Ok(new Response { Data = lesson, Message = "Xóa thành công !", Status = 200 });
        }

        public static string[] Scopes = { DriveService.Scope.Drive };

        public static DriveService GetService()
        {
            UserCredential credential;
            using (var stream = new FileStream(@"credentials.json", FileMode.Open, FileAccess.Read))
            {
                string FolderPath = @"";
                string FilePath = Path.Combine(FolderPath, "DriveServiceCredentials.json");

                credential = GoogleWebAuthorizationBroker.AuthorizeAsync(
                    GoogleClientSecrets.FromStream(stream).Secrets,
                    Scopes,
                    "user",
                    CancellationToken.None,
                    new FileDataStore(FilePath, true)).Result;
            }

            DriveService service = new DriveService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = "ProjectLMS"
            });

            return service;
        }

        private static string CreateFolder(string accountID)
        {
            DriveService service = GetService();
            FilesResource.ListRequest FileListRequest = service.Files.List();

            FileListRequest.Fields = "nextPageToken, files(id, name, size, version, createdTime)";

            IList<Google.Apis.Drive.v3.Data.File> files = FileListRequest.Execute().Files;
            List<GoogleDriveFiles> FileList = new List<GoogleDriveFiles>();

            string folderID = "";
            if (files != null && files.Count > 0)
            {
                foreach (var file in files)
                {
                    if (file.Name == accountID) folderID = file.Id;
                }
            }

            if (folderID == "")
            {
                var fileMetadata = new Google.Apis.Drive.v3.Data.File
                {
                    Name = accountID,
                    MimeType = "application/vnd.google-apps.folder"
                };
                var folderRequest = service.Files.Create(fileMetadata);
                folderRequest.Fields = "id";
                Google.Apis.Drive.v3.Data.File FolderMoi = folderRequest.Execute();
                service.Files.Create(fileMetadata).Fields = "id";

                folderID = FolderMoi.Id;
            }

            return folderID;
        }

        //<summary>Upload file bài học</summary>
        [HttpPost("UploadFiles/{lessonID}")]
        public async Task<ActionResult<Response>> UploadFiles(IFormFile file, string lessonID)
        {
            if (file != null && file.Length > 0)
            {
                DriveService service = GetService();
                LESSON lesson = await _context.LESSONs.FirstOrDefaultAsync(x => x.LessonID == lessonID );
                try
                {
                    string path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", file.FileName);

                    using (var stream = new FileStream(path, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }

                    var FileMetaData = new Google.Apis.Drive.v3.Data.File();
                    FileMetaData.Name = Path.GetFileName(file.FileName);

                    string folderID = CreateFolder(lessonID);

                    FileMetaData.Parents = new List<string> { folderID };

                    FilesResource.CreateMediaUpload request;

                    using (var stream = new FileStream(path, FileMode.Open))
                    {
                        request = service.Files.Create(FileMetaData, stream, file.ContentType);
                        request.Fields = "id";
                        request.Upload();
                    }

                    System.IO.File.Delete(path);
                    
                    lesson.UrlLesson = "https://drive.google.com/file/d/" + request.ResponseBody.Id + "/view?usp=sharing";
                    
                    await _context.SaveChangesAsync();

                    return Ok(new Response { Data = "https://drive.google.com/file/d/" + request.ResponseBody.Id + "/view?usp=sharing", Message = "Upload thành công", Status = 200 });
                }
                catch (Exception)
                {
                    return BadRequest(new Response { Data = null, Message = "Upload không thành công", Status = 400 });

                }
            }

            return BadRequest(new Response { Data = null, Message = "Upload không thành công", Status = 400 });
        }

    }
}