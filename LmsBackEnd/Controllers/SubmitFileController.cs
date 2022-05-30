using LmsBackEnd.Models;
using LmsBackEnd.Repository;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LmsBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubmitFileController : ControllerBase
    {
        private readonly LmsContext _context;

        public SubmitFileController(LmsContext context)
        {
            _context = context;
        }

        [HttpGet("List")]
        public async Task<ActionResult<Response>> GetFiles()
        {
            var files = GoogleDriveFilesRepository.GetDriveFiles();
            return Ok(new Response { Data = files, Message = "Lấy files thành công", Status = 200 });
        }

        [HttpPost("UploadFile/{accountID}")]
        public async Task<ActionResult<Response>> UploadFile(IFormFile file, string accountID)
        {

            try
            {
                var result = GoogleDriveFilesRepository.FileUpload(file, accountID);
                string message = "Gặp lỗi trong quá trình upload file!";
                if (result != "0")
                {


                    message = "Tải lên thành công!";

                    var point = new POINT();
                    point.Folder = accountID;
                    point.Url = result;
                    point.DateSubmit = DateTime.Now;
                    point.point = 0;

                    try
                    {
                        await _context.POINTs.AddAsync(point);
                        await _context.SaveChangesAsync();
                    }
                    catch (Exception e)
                    {
                        return BadRequest(e.Message);
                    }


                }

                return Ok(new Response { Data = result, Message = message });
            }
            catch (Exception ex)
            { return BadRequest(ex.Message); }




        }

        //[HttpPost("DownloadFile")]
        //public async Task<ActionResult<Response>> DownloadFile(string fileID)
        //{
        //    var result = GoogleDriveFilesRepository.DownloadFile(fileID);

        //    string message = "Download file thành công!";
        //    if (result == "0") message = "Gặp lỗi trong quá trình download!";

        //    return Ok(new Response { Data = result, Message = message });
        //}
    }
}
