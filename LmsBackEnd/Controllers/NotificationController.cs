using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LmsBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly LmsContext _context;
        private readonly IUriService uriService;
        private readonly INotify _notify;
        public NotificationController(IMapper mapper, INotify notify, LmsContext context, IUriService uriService)
        {
            _mapper = mapper;
            _context = context;
            _notify = notify;
            this.uriService = uriService;
        }


        ///<summary>Tìm tất cả Thông báo thêm hiển thị cho admin phê duyệt</summary>
        [HttpGet("AllNotifyAdmin")]
        public async Task<ActionResult<Response>> GetAllNotifyAdmin()
        {
            var user = await _notify.GetALLAdmin();
            if (user == null)
            {
                return BadRequest(new Response { Data = user, Message = "Không có thông báo nào trong hệ thống", Status = 400 });

            }
            return Ok(new Response { Data = user, Message = "Danh sách thông báo", Status = 200 });
        }

        ///<summary>Tìm tất cả Thông báo thêm hiển thị lên trang chủ</summary>
        [HttpGet("AllNotify")]
        public async Task<ActionResult<Response>> GetAllNotify()
        {
            var user = await _notify.GetALL();
            if (user == null)
            {
                return BadRequest(new Response { Data = user, Message = "Không có thông báo nào trong hệ thống", Status = 400 });

            }
            return Ok(new Response { Data = user, Message = "Danh sách thông báo", Status = 200 });
        }

        ///<summary>Xem danh sách Thông báo đã phân trang</summary>
        [HttpGet("ListNotifyPagination")]
        public async Task<ActionResult<Response>> ListNotification([FromQuery] FilterPage filter, string NotifyInfo)
        {
            //var courelist = await _course.GetALL();
            var route = Request.Path.Value;
            var validFilter = new FilterPage(filter.PageNumber, filter.PageSize);

            // var searchid = await _course.GetCourseID(courseInfo);
            // var searchname = await _course.GetCourseByName(courseInfo);
            List<NOTIFY> notify;
            if (NotifyInfo == null)
            {
                notify = await _context.NOTIFIes
               .Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
               .Take(validFilter.PageSize)
               .ToListAsync();
            }
            else
            {
                notify = await _context.NOTIFIes
                   .Where(c => (c.NotifyID.Contains(NotifyInfo) || c.NotifyName.Contains(NotifyInfo)) && c.IsConfirmed)
                   .Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
                   .Take(validFilter.PageSize)
                   .ToListAsync();
            }

            var totalRecords = await _context.NOTIFIes.CountAsync();
            //var pagedReponse = PaginationHelper.CreatePagedReponse<COURSE>(courses, validFilter, totalRecords, uriService, route);

            if (notify == null)
            {
                return BadRequest(new Response { Data = notify, Message = "Không có thông báo trong hệ thống", Status = 400 });
            }
            var pagedReponse = PaginationHelper.CreatePagedReponse<NOTIFY>(notify, validFilter, totalRecords, uriService, route);
            return Ok(pagedReponse);
        }


        ///<summary>Tạo thông báo</summary>
        [HttpPost("CreateNotification")]
        public async Task<IActionResult> CreateNotification(NOTIFY notify)
        {
            if (notify.NotifyID == "")
                return BadRequest("Không được bỏ trống mã thông báo!");

            if (notify.NotifyName == "")
                return BadRequest("Không được bỏ trống tên thông báo!");

            if (notify.NotifyDetail == "")
                return BadRequest("Không được bỏ trống nội dung thông báo!");

            if (notify.NotifyID.Length > 5)
                return BadRequest("Quá số lượng ký tự!");

            var checkID = await _context.NOTIFIes.FirstOrDefaultAsync(n => n.NotifyID == notify.NotifyID);
            if (checkID != null)
                return BadRequest("Trùng mã thông báo!");

            await _context.NOTIFIes.AddAsync(notify);
            await _context.SaveChangesAsync();

            return Created("", notify);
        }

        ///<summary>Duyệt thông báo</summary>
        [HttpPut("AllNotifyAdmin/{id}")]
        public async Task<IActionResult> ChangeNotificationStatus(string id)
        {
            var notify = await _context.NOTIFIes.FirstOrDefaultAsync(n => n.NotifyID == id);

            if (notify == null)
                return BadRequest("Sai mã thông báo!");

            // _context.Entry(notify).State = EntityState.Modified;

            try
            {
                notify.IsConfirmed = true;
                notify.IsOutDated = false;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NotificationExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(new Response { Data = notify, Message = "Duyệt thành công", Status = 200 });
        }

        private bool NotificationExists(string id)
        {
            return _context.NOTIFIes.Any(n => n.NotifyID == id);
        }
    }
}
