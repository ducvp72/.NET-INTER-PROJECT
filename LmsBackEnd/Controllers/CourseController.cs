
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;


namespace LmsBackEnd
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseController : ControllerBase
    {
        private readonly LmsContext _context;
        private readonly ICourse _course;
        private readonly IMapper _mapper;
        private readonly IUriService uriService;
        private BlobServiceClient _blobService;

        public CourseController(LmsContext context, ICourse course, IMapper mapper, IUriService uriService,  BlobServiceClient blobService)
        {
            _blobService = blobService;
            _context = context;
            _course = course;
            _mapper = mapper;
            this.uriService = uriService;
        }


        ///<summary>Thêm khóa học va hình ảnh</summary>
        [HttpPost("AddFullCourse")]
        public async Task<ActionResult<Response>> AddCoursewithImg([FromForm]CourseCreate courseCreate,IFormFile files)
        {
            var courseID = await _course.GetCourseID(courseCreate.CourseID);
            var courseName = await _course.GetCourseByName(courseCreate.CourseName);
            var courseModel = _mapper.Map<COURSE>(courseCreate);

            if (courseID != null)
            {
                return BadRequest(new Response { Data = courseModel, Message = " ID Khóa học tồn tại", Status = 400 });
            }
            if (courseName != null)
            {
                return BadRequest(new Response { Data = courseModel, Message = "Tên Khóa học tồn tại", Status = 400 });
            }
            
            if (Request.Form.Files.Count < 0)
            {
                return NotFound("Vui long nhap hinh");
            }
            var file = Request.Form.Files[0];
            courseModel.filetype= file.FileName ;
            var containerClient = _blobService.GetBlobContainerClient("medias");
            var blobClient = containerClient.GetBlobClient("course-" + courseModel.CourseID + file.FileName);

            await using var memoryStream = file.OpenReadStream();
            await blobClient.UploadAsync(memoryStream, new BlobHttpHeaders { ContentType = file.ContentType });
            // return Ok("Upload thanh cong");
            await _course.AddCourse(courseModel);
            await _course.SaveChange();
            return Created("", new Response { Data = courseModel, Message = "Thêm khóa học thành công", Status = 201 });
        }

        ///<summary>Upload anh cho KH</summary>
        [HttpPost("UploadFile/{id}")]
        public async Task<ActionResult<COURSE>> Postimgs(IFormFile files, string id)
        {
            var course = await _context.COURSEs.FirstOrDefaultAsync(x => x.CourseID == id);
            if (course == null)
            {
                return NotFound("Không tìm thấy khóa học");
            }
            var file = Request.Form.Files[0];
            if (file.Length < 0)
            {
                return NotFound("Vui long nhap hinh");
            }
            course.filetype= file.FileName ;
            var containerClient = _blobService.GetBlobContainerClient("medias");
            var blobClient = containerClient.GetBlobClient("course-" + id + file.FileName);
            await using var memoryStream = file.OpenReadStream();
            await blobClient.UploadAsync(memoryStream, new BlobHttpHeaders { ContentType = file.ContentType });
            await _course.SaveChange();
            return Ok("Upload thanh cong");
        }

        ///<summary>Get anh cho KH</summary>
        [HttpGet("GetUrlFile/{id}")]
        public async Task<ActionResult<COURSE>> Getimgs(string id)
        {
            var course = await _context.COURSEs.FirstOrDefaultAsync(x => x.CourseID == id);
            if (course == null)
            {
                return NotFound("Không tìm thấy khóa học");
            }
            var containerClient = _blobService.GetBlobContainerClient("medias");
            var blobClient = containerClient.GetBlobClient("course-" + id + course.filetype);
            var blobDowload = await blobClient.DownloadStreamingAsync();
            string contentType;
            new FileExtensionContentTypeProvider().TryGetContentType(course.filetype, out contentType);
            return File(blobDowload.Value.Content, contentType);
        }

        ///<summary>Tải ảnh xuống cho KH</summary>
        [HttpPost("DowLoadUrlFile/{id}")]
        public async Task<ActionResult<COURSE>> Dowimgs(string id)
        {
            var course = await _context.COURSEs.FirstOrDefaultAsync(x => x.CourseID == id);
            if (course == null)
            {
                return NotFound("Không tìm thấy khóa học");
            }
            var containerClient = _blobService.GetBlobContainerClient("medias");
            var blobClient = containerClient.GetBlobClient("course-" + id + course.filetype);
            var blobDowload = await blobClient.DownloadStreamingAsync();
            string contentType;
            new FileExtensionContentTypeProvider().TryGetContentType(course.filetype, out contentType);
            return File(blobDowload.Value.Content, contentType, "course-" + id + course.filetype);
        }   

        ///<summary>Tìm bài học theo khóa học</summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<LESSON>>> GetLessonsByIDCourse(string id)
        {
            var lessons = await _context.LESSONs.Where(lesson => lesson.CourseID == id).ToListAsync();
            if (lessons == null)
            {
                return NotFound("Không tìm thấy khóa học");
            }

            return lessons;
        }
        
        ///<summary>Tìm tất cả Khóa học thêm vào slide</summary>
        [HttpGet("AllCourse")]
        public async Task<ActionResult<Response>> GetALLCoursList(string searchcourseInfo)
        {  
            if(searchcourseInfo == null)
            {
                var courelist = await _course.GetALL();
                return Ok(new Response { Data = courelist, Message = "Danh sách khóa học", Status = 200 });
            }

            var courses = await _context.COURSEs
                    .Where(c => c.CourseID.Contains(searchcourseInfo) || c.CourseName.Contains(searchcourseInfo))
                    .ToListAsync();
            return Ok(new Response { Data = courses, Message = "Kết quả tìm kiếm", Status = 200 });
        }
       
       ///<summary>Lấy danh sách khóa học theo phân trang - ID - Name </summary>
        [HttpGet("CourseListPagination")]
        public async Task<ActionResult<Response>> GetCoursList([FromQuery] FilterPage filter, string courseInfo)
        {
            //var courelist = await _course.GetALL();
            var route = Request.Path.Value;
            var validFilter = new FilterPage(filter.PageNumber, filter.PageSize);
            List<COURSE>  courses ;
            if (courseInfo == null)
            {
                 courses = await _context.COURSEs
                .Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
                .Take(validFilter.PageSize)
                .ToListAsync();  
            }
            else 
            {
                 courses = await _context.COURSEs
                    .Where(c => c.CourseID.Contains(courseInfo) || c.CourseName.Contains(courseInfo))
                    .Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
                    .Take(validFilter.PageSize)
                    .ToListAsync();
            }

                var totalRecords = await _context.COURSEs.CountAsync();
                //var pagedReponse = PaginationHelper.CreatePagedReponse<COURSE>(courses, validFilter, totalRecords, uriService, route);

                if (courses == null)
                {
                    return BadRequest(new Response { Data = courses, Message = "Không có khóa học nào trong hệ thống", Status = 400 });
                }
                var pagedReponse = PaginationHelper.CreatePagedReponse<COURSE>(courses, validFilter, totalRecords, uriService, route);
                return Ok(pagedReponse);
        }


        ///<summary>Thêm khóa học</summary>
        [HttpPost("AddCourse")]
        public async Task<ActionResult<Response>> AddCourse(CourseCreate courseCreate)
        {
            var courseID = await _course.GetCourseID(courseCreate.CourseID);
            var courseName = await _course.GetCourseByName(courseCreate.CourseName);
            var courseModel = _mapper.Map<COURSE>(courseCreate);

            if (courseID != null)
            {
                return BadRequest(new Response { Data = courseModel, Message = " ID Khóa học tồn tại", Status = 400 });
            }
            if (courseName != null)
            {
                return BadRequest(new Response { Data = courseModel, Message = "Tên Khóa học tồn tại", Status = 400 });
            }
            await _course.AddCourse(courseModel);
            await _course.SaveChange();
            return Created("", new Response { Data = courseModel, Message = "Thêm khóa học thành công", Status = 201 });
        }

        ///<summary>Xóa khóa học</summary>
        [HttpDelete("Delete/{courseid}")]
        public async Task<ActionResult<Response>> DeleteCourse(string courseid)
        {
            var courseDel = await _course.GetCourseID(courseid);
            // var check = await _context.ENROLLs.FirstOrDefaultAsync(x => x.CourseID == courseid);
            // if(check != null)
            // {
            //     return BadRequest(new Response { Data= null, Message= "Có học sinh đang đăng kí khóa học !", Status= 400 });
            // }
            if (courseDel == null)
            {
                return BadRequest(new Response { Data = courseDel, Message = "Không tìm thấy ID để xóa", Status = 400 });
            }
            await _course.DeleteCourse(courseDel);
            await _course.SaveChange();
            return Ok(new Response { Data = courseDel, Message = "Xóa thành công", Status = 200 });
        }

        ///<summary>Cập nhật khóa học</summary>
        [HttpPut("Update/{courseid}")]
        public async Task<ActionResult<Response>> UpdateCourse(string courseid, LessonCourse lessonCourse)
        {
            var course = await _course.GetCourseID(courseid);
            _mapper.Map(lessonCourse, course);
            await _course.SaveChange();
            return Ok(new Response { Data = course, Message = "Khóa học đã được update", Status = 200 });
        }

        ///<summary>Tìm khóa học theo id</summary>
        [HttpGet("SearchCoursByID/{courseID}")]
        public async Task<ActionResult<Response>> SearchCourseByID(string courseID)
        {
            var search = await _course.SearchCourseByID(courseID);
            if (search == null)
            {
                return BadRequest(new Response { Data = search, Message = "Không tồn tại Course", Status = 400 });
            }
            return Ok(new Response { Data = search, Message = "Kết quả tìm kiếm", Status = 200 });
        }

        ///<summary>Tìm khóa học theo name</summary>
        [HttpGet("SearchCoursByName/{courseName}")]
        public async Task<ActionResult<Response>> SearchCourseByName(string courseName)
        {
            var search = await _course.SearchCourseByName(courseName);
            if (search == null)
            {
                return BadRequest(new Response { Data = search, Message = "Không tồn tại Course", Status = 400 });
            }
            return Ok(new Response { Data = search, Message = "Kết quả tìm kiếm", Status = 200 });
        }

        ///<summary> Lấy tất cả đăng kí Khóa học</summary>
        [HttpGet("GetAllEnrolledCourse")]
        public async Task<ActionResult<Response>> GetAllEnroll()
        {
            var getall = await _context.ENROLLs.ToListAsync();
            if(getall == null)
            {
               return BadRequest(new Response { Data = null, Message = "Không có đăng kí khóa học nào trong hệ thống", Status = 400 });

            }
            return Ok(getall);
        }

        ///<summary>Lấy tất cả các khóa học đã đăng ký của user</summary>
        [HttpGet("GetEnrolledCourse/{accountID}")]
        public async Task<ActionResult<IEnumerable<ENROLL>>> GetEnrolledCourseByID(string accountID)
        {
            var courses = await _context.ENROLLs.Where(enroll => enroll.AccountID == accountID).ToListAsync();
            if (courses == null)
            {
                return NotFound("Không tìm thấy khóa học");
            }
            return courses;
        }

        ///<summary>User đăng kí khóa học</summary>
        [HttpPost("UserEnrollCourse")]
        public async Task<ActionResult<Response>> EnrollCourse(EnrollCourse enrollCourse)
        {
            var course = await _course.GetCourseID(enrollCourse.CourseID);
            var user = await _context.ACCOUNTs.FindAsync(enrollCourse.AccountID);
            var enroll = await _course.GetCourseByIdEnroll(enrollCourse.AccountID, enrollCourse.CourseID);
            var courseModel = _mapper.Map<ENROLL>(enrollCourse);
            if(enrollCourse.AccountID == null || enrollCourse.CourseID == null)
            {
                return BadRequest(new Response { Data = "", Message = "Vui lòng đăng nhập trước khi đăng ký", Status = 400 });
            }
            if(enroll != null)
            {
                return BadRequest(new Response { Data = "", Message = "User đã đăng kí khóa học này rồi !", Status = 400 });
            }
            if(course == null)
            {
                
                return BadRequest(new Response { Data = "", Message = "Không tồn tại Course để đăng kí hoặc User", Status = 400 });
            }
            if(user == null)
            {
                return BadRequest(new Response { Data = "", Message = "Không tồn tại User để đăng kí", Status = 400 });
            }
            else 
                await _context.ENROLLs.AddAsync(courseModel);
                await _course.SaveChange();
                return Created("", new Response { Data = null, Message = "Đăng kí khóa học thành công", Status = 201 });

        }

        ///<summary>Xóa User khỏi khóa học</summary>
        [HttpDelete("DeleteUserFromCouse/{userId}")]
        public async Task<ActionResult<Response>> DelEnrollCourse(string userId, string courseID)
        {
            var course = await _course.GetCourseID(courseID);
            var enroll = await _course.GetCourseByIdEnroll(userId, courseID);
            if(userId == null || courseID == null)
            {
                return BadRequest(new Response { Data = "", Message = "Vui lòng điền đầy đủ các trường", Status = 400 });
            }
            if(enroll == null || course == null)
            {
                return BadRequest(new Response { Data = "", Message = "User không năm trong khóa học", Status = 400 });
            }
            else 
                _context.ENROLLs.Remove(enroll);
                await _course.SaveChange();
                return Accepted(new Response { Data = enroll, Message = "Xóa thành công", Status = 201 });
        }

        ///<summary>Cập nhật khóa học đã đăng kí của User</summary>
        [HttpPut("UpdateEnroll/{userid}")]
        public async Task<ActionResult<Response>> UpdateEnroll(string userid, string couseID, EditCourseUser editCourseUser)
        {
            var enroll = await _course.GetCourseByIdEnroll(userid,couseID);
            var course = await _course.GetCourseID(couseID);
            if(enroll == null)
            {
                return BadRequest(new Response{Data= null, Message= "User không đăng kí khóa học này !", Status = 400});
            }
            if(course == null)
            {
                return BadRequest(new Response{Data = null, Message="Khóa học này không tồn tại trông hệ thống !"});
            }
            _mapper.Map(editCourseUser, enroll);
            await _course.SaveChange();
            var model = _mapper.Map<ReadEnroll>(enroll);
            return Ok(new Response { Data = model, Message = "Sửa đăng kí thành công", Status = 200 });
        }
    
    }
}