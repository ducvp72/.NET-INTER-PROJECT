
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using LmsBackEnd.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LmsBackEnd.Dtos;
using System;
using Microsoft.AspNetCore.Authorization;

namespace LmsBackEnd
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly LmsContext _context;
        private readonly IUriService uriService;
        private readonly IRegister _register;
        private IMailService _mailService;
        private ILoginInfoService _loginInfoService;

        public UserController(IMailService mailService, IMapper mapper,
        IRegister register, LmsContext context,
         IUriService uriService, ILoginInfoService loginInfoService)
        {
            _mapper = mapper;
            _context = context;
            _register = register;
            this.uriService = uriService;
            _mailService = mailService;
            _loginInfoService = loginInfoService;
        }


        ///<summary>Tìm tất cả User thêm vào slide</summary>
        [HttpGet("AllUser")]
        public async Task<ActionResult<Response>> GetAllUser()
        {
            var user = await _register.GetALL();
            if (user == null)
            {
                return BadRequest(new Response { Data = user, Message = "Không có user nào trong hệ thống", Status = 400 });

            }
            return Ok(new Response { Data = user, Message = "Danh sách  User", Status = 200 });
        }

        ///<summary>Xem danh sách User Theo phân trang</summary>
        [HttpGet("ListUserPagination")]
        public async Task<ActionResult<Response>> GetUserList([FromQuery] FilterPage filter, string userInfo)
        {
            //var courelist = await _course.GetALL();
            var route = Request.Path.Value;
            var validFilter = new FilterPage(filter.PageNumber, filter.PageSize);

            // var searchid = await _course.GetCourseID(courseInfo);
            // var searchname = await _course.GetCourseByName(courseInfo);
            List<ACCOUNT> user;
            if (userInfo == null)
            {
                user = await _context.ACCOUNTs
               .Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
               .Take(validFilter.PageSize)
               .ToListAsync();
            }
            else
            {
                user = await _context.ACCOUNTs
                   .Where(c => c.ID.Contains(userInfo) || c.Name.Contains(userInfo))
                   .Skip((validFilter.PageNumber - 1) * validFilter.PageSize)
                   .Take(validFilter.PageSize)
                   .ToListAsync();
            }

            var totalRecords = await _context.ACCOUNTs.CountAsync();
            //var pagedReponse = PaginationHelper.CreatePagedReponse<COURSE>(courses, validFilter, totalRecords, uriService, route);

            if (user == null)
            {
                return BadRequest(new Response { Data = user, Message = "Không có user nào trong hệ thống", Status = 400 });
            }
            var pagedReponse = PaginationHelper.CreatePagedReponse<ACCOUNT>(user, validFilter, totalRecords, uriService, route);
            return Ok(pagedReponse);
        }

        ///<summary>Thêm User</summary>
        [HttpPost("AddUser")]
        public async Task<ActionResult> CreateUser(CreateUser createUser)
        {
            if (createUser.Name == null || createUser.UserName == null || createUser.UserPassword == null || createUser.UserRole == null)
            {
                return BadRequest(new Response { Data = "", Message = "Vui lòng nhập đầy đủ các trường thông tin", Status = 400 });
            }
            //Check tuổi
            var age = DateTime.UtcNow.Year - createUser.NgaySinh.Year;
            if (age < 16)
            {
                return BadRequest(new Response { Data = "", Message = "User < 16 tuổi", Status = 400 });
            }
            var userName = await _register.GetByName(createUser.UserName);
            var userEmail = await _register.GetByEmail(createUser.Email);
            if (userName != null)
            {
                return BadRequest(new Response { Data = "", Message = "Trùng Username", Status = 400 });
            }
            if (userEmail != null)
            {
                return BadRequest(new Response { Data = "", Message = "Trùng Email", Status = 400 });
            }
            var accountModel = _mapper.Map<ACCOUNT>(createUser);
            var accounts = await _register.GetALL();
            var id = accounts.ToList().Count() + 10000000;
            accountModel.ID = id.ToString();
            accountModel.IsMailConfirmed = true;

            await _register.AddUser(accountModel);
            await _register.SaveChange();
            return Created("", new Response { Data = accountModel, Message = "Tạo User thành công", Status = 201 });
        }

        ///<summary>Xóa User</summary>
        [HttpDelete("DeleteUser/{id}")]
        public async Task<ActionResult> DeleteUser(string id)
        {
            var user = await _register.GetUserID(id);
            if (user != null)
            {
                _register.DeleteUserID(user);
                await _register.SaveChange();
                return Accepted(new Response { Data = user, Message = "Xóa thành công ", Status = 200 });
            }
            return NotFound(new Response { Data = "", Message = "Không tìm thấy User để xóa", Status = 400 });
        }

        ///<summary>Sửa User</summary>
        [HttpPut("UpdateUser/{userid}")]
        public async Task<ActionResult> UpdateUser([FromBody] ChangeUserInfo userInfo, string userid)
        {
            var user = await _register.GetUserID(userid);
            if (user != null)
            {
                if (userInfo.Name == null || userInfo.UserPassword == null || userInfo.UserRole == null)
                {
                    return BadRequest(new Response { Data = "", Message = "Vui lòng nhập đầy đủ các trường thông tin", Status = 400 });
                }
                //Check tuổi
                var age = DateTime.UtcNow.Year - userInfo.NgaySinh.Year;
                if (age < 16)
                {
                    return BadRequest(new Response { Data = "", Message = "User < 16 tuổi", Status = 400 });
                }
                _mapper.Map(userInfo, user);
                await _register.SaveChange();
                return Accepted(new Response { Data = "", Message = "Cập nhật User thành công", Status = 200 });
            }
            return NotFound(new Response { Data = "", Message = "Không tìm thấy User để cập nhật", Status = 400 });
        }

        ///<sumary>Danh sách các role trong hệ thống</sumary>
        [HttpGet("RoleList")]
        public async Task<ActionResult<Response>> GetALLRole()
        {
            var role = await _context.ROLEs.ToListAsync();
            if (role == null)
            {
                return BadRequest("Không có role nào đê chọn !");

            }
            return Ok(new Response { Data = role, Message = "Danh sách  Role", Status = 200 });
        }

        ///<summary>Lấy thông tin user ra</summary>
        [HttpGet("Info/{id}")]
        public async Task<ActionResult<Response>> GetUserInfo(string id)
        {
            var user = await _register.GetUserID(id);
            if (user == null)
            {
                return BadRequest(new Response { Data = "", Message = "ID User không tồn tài", Status = 400 });
            }
            return Ok(new Response { Data = user, Message = "Thông tin User", Status = 200 });
        }

        ///<summary>User chỉnh sửa thông tin</summary>
        [HttpPut("EditUser/{id}")]
        public async Task<ActionResult<Response>> EditUser(string id, [FromBody] UserchangeInfo userchangeInfo)
        {
            var user = await _register.GetUserID(id);
            if (user != null)
            {
                if (userchangeInfo.Name == "")
                {
                    return BadRequest(new Response { Data = "", Message = "Vui lòng nhập đầy đủ các trường thông tin", Status = 400 });
                }
                //Check tuổi
                var age = DateTime.UtcNow.Year - userchangeInfo.NgaySinh.Year;
                if (age < 16)
                {
                    return BadRequest(new Response { Data = "", Message = "User < 16 tuổi", Status = 400 });
                }
                _mapper.Map(userchangeInfo, user);
                await _register.SaveChange();
                return Accepted(new Response { Data = user, Message = "Cập nhật User thành công", Status = 200 });
            }
            return NotFound(new Response { Data = "", Message = "Không tìm thấy User để cập nhật", Status = 400 });
        }
#region Change Email
        ///<summary>User chỉnh sửa Email</summary>
        [HttpPut("EditUserEmail/{id}")]
        public async Task<ActionResult<Response>> EditEmailUser(string id, ChangeEmail changeEmail)
        {
            string sMessage = "";
            var user = await _register.GetUserID(id);
            var userEmail = await _register.GetByEmail(changeEmail.Email);
            if (user != null)
            {
                //Kiểm tra email trùng cần xài thì gỡ ra không thì khóa lại vì không có nhiểu Email !
                // if (userEmail != null || userEmail.Email == changeEmail.Email)
                // {
                //     return BadRequest(new Response { Data = "", Message = "Email đã được sử dụng hoặc không hợp lệ !", Status = 400 });
                // }
                
                MailModel oMailModel = new MailModel();
                oMailModel.Subject = "Mail confirmation";
                oMailModel.Body = _mailService.GetMailBodyChangeEmail(id, changeEmail.Email);
                oMailModel.ToMails = new List<string>()
                {
                    changeEmail.Email
                };
                sMessage = await _mailService.SendMail(oMailModel);

                // _mapper.Map(changeEmail, user);
                await _register.SaveChange();

                if (sMessage != Message.MailSent) return BadRequest(new { message = sMessage });
                else return Accepted(new Response { Data = null, Message = "Đổi email thành công vui lòng qua email mới để xác nhận", Status = 200 });
            }
            return BadRequest(new Response { Data = "", Message = "Đổi email không thành công", Status = 400 });
        }
#endregion

#region Service Email
        ///<summary>Chỉ dùng Test nhanh đỡ phải qua email xác nhận</summary>
        [HttpPost("Confirmmail/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> ConfirmMail(string id, string email)
        {
            var user = await _register.GetUserID(id);
            //null return badrequest
            user.Email = email;
            await _register.SaveChange();

            //Đổi đường dẫn sau khi qua xác nhận đổi Email trên Email mới ở dây !
            return Redirect("https://www.google.com.vn/?hl=vi");
        }
        private MailModel GetMailObject(ACCOUNT user)
        {
            MailModel oMailModel = new MailModel();
            oMailModel.Subject = "Mail confirmation";
            oMailModel.Body = _mailService.GetMailBody(user);
            oMailModel.ToMails = new List<string>()
            {
                user.Email
            };
            return oMailModel;
        }
#endregion

#region chưa xử lí được !
        ///<summary>User quên pass nhap email để gửi confirm</summary>
        [HttpPut("ForgotPass")]
        public async Task<ActionResult<Response>> Forget(Forgotpass user)
        {

            var tempt = await _register.GetByEmail(user.Email);
            var check = await _context.ACCOUNTs.FirstOrDefaultAsync(x=>x.Email == user.Email && x.UserName == user.UserName);            
            if(check == null)
            {
                return BadRequest(new Response { Data = null, Message = "Email và Username không khớp", Status = 400 });
            }
            MailModel oMailModel = new MailModel();
            oMailModel.Subject = "Mail confirmation";
            oMailModel.Body = _mailService.GetMailBodyChangePassword(check.ID);
            oMailModel.ToMails = new List<string>()
                {
                    user.Email
                };
            var sMessage = await _mailService.SendMail(oMailModel);

            // _mapper.Map(changeEmail, user);
            await _register.SaveChange();

            if (sMessage != Message.MailSent) return BadRequest(new { message = sMessage });
            else return Accepted(new Response { Data = user, Message = "Hãy vào Email đã nhập để xác nhận", Status = 200 });
        }

        ///<summary>User quên pass nhập username và nhập mk mới khi ấn qua confirm ở Email sẽ có 1 trang kiếm</summary>
        [HttpPost("Forget/{username}")]
        public async Task<ActionResult<Response>> Forget(string username, [FromForm] ForgetPass forgetPass)
        {
            // Console.WriteLine(forgetPass.UserPassword);
            var user = await _register.GetByName(username);
            if (user != null)
            {
                if(forgetPass.UserPassword != forgetPass.ConfirmPassword)
                {
                    return BadRequest(new Response {Data ="", Message="Vui lòng xác nhận đúng mật khẩu !", Status=400});
                }
                user.UserPassword = forgetPass.UserPassword;
                await _register.SaveChange();
                return Ok(new Response {Data = user, Message="Tài khoản đã được khôi phục !", Status=200});
            }
            return BadRequest(new Response {Data ="", Message="Tài khoản không tồn tại !", Status=400});
        }
 #endregion   
    
    }
}