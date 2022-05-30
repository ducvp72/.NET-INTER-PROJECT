
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using LmsBackEnd.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LmsBackEnd.Controllers
{
    [ApiController]
    [Route("api")]
    public class RegisterController : ControllerBase
    {
        private readonly IRegister _register;
        private readonly IMapper _mapper;
        private ILoginInfoService _loginInfoService;
        private IMailService _mailService;

        public RegisterController(IRegister register, IMapper mapper
        , ILoginInfoService loginInfoService, IMailService mailService)
        {
            _register = register;
            this._mapper = mapper;
            _loginInfoService = loginInfoService;
            _mailService = mailService;
        }

        ///<summary>Đăng ký</summary>
        /// <response code="201">Tạo tài khoản thành công !</response>
        /// <response code="400">Các trường không được bỏ trống !</response>  
        [HttpPost("Register")]
        // [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> AddUser(AccountCreate accountCreate)
        {
            string sMessage = "";
            var age = DateTime.UtcNow.Year - accountCreate.NgaySinh.Year;
            //Check tuổi
            // Console.WriteLine(age);
            if (age < 16)
            {
                return BadRequest("Bạn chưa đủ tuổi để đăng ký.....");
            }

            #region Check email tồn tại: không dùng comment hết region lại đề 1 email có thể tạo nhiều tài khoản !
            //Check email tồn tại
            // var email = await _register.GetByEmail(accountCreate.Email);
            // if(email != null)
            // {

            //     return BadRequest("Email đã được đăng ký, vui lòng chọn email khác ....");
            // }
            #endregion

            //Check Tên User
            var checkname = await _register.GetByName(accountCreate.UserName);
            if (checkname != null)
            {
                return BadRequest("User Trùng .....");
            }
            //Trả dữ liệu
            var accountModel = _mapper.Map<ACCOUNT>(accountCreate);
            var accounts = await _register.GetALL();
            //Tính toán ID
            accounts.ToList().ForEach(x=> Console.WriteLine(x.UserName));
            var id = accounts.ToList().Count() + 10000000;
            accountModel.ID = id.ToString();
            
            //Xác nhận Email
            if (accountModel.IsMailConfirmed)
            {
                MailModel omailModel = this.GetMailObject(accountModel);
                await _mailService.SendMail(omailModel);
                return BadRequest(new { message = Message.MailSent });
            }
            
            MailModel oMailModel = this.GetMailObject(accountModel);
            sMessage = await _mailService.SendMail(oMailModel);

            await _register.AddUser(accountModel);
            await _register.SaveChange();
            //Tạo Tài khoản
            if (sMessage != Message.MailSent) return BadRequest(new { message = sMessage });
            else return Created("", accountModel);
        }

        //Xác nhận tài khoản: nhập tài khoản vào để xác nhận email cho lẹ đỡ qua gmail
        ///<summary>Nhập tài khoản để xác nhận email</summary>
        [HttpPost]
        [AllowAnonymous]
        [Route("Confirmmail")]
        public async Task<IActionResult> ConfirmMail(string username)
        {
            string sMessage = await _loginInfoService.ConfirmMail(username);
            if (sMessage == Message.Success)
            {
                //Chuyển trang đăng ký và bắt user đăng nhập lại với đường dãn URL                
                return Redirect("http://lmsfpt-group4.surge.sh/login");
            }
            else
            {
                //Xác nhận lỗi
                return Ok(new { message = sMessage });
            }

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

        [HttpGet("ListRegister")]
        public async Task<ActionResult<IEnumerable<ACCOUNT>>> GetALL()
        {
            var user = await _register.GetALL();
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        ///<summary>Đổi mật khẩu</summary>
        /// <response code="202">Đổi mật khẩu thành công thành công !</response>
        /// <response code="400">Đổi mật khẩu không thành công !</response>  
        [HttpPut("ChangePassword")]
        public async Task<ActionResult<Response>> ChangePassword([FromBody] ChangePassword change)
        {
            var usermodel = await _register.GetByName(change.UserName);
            if (usermodel == null)
            {
                // return BadRequest(new Response { Data = null, Message = "Vui lòng nhập chính xác tài khoản của bạn !", Status = 400 });
                 return BadRequest("Vui lòng nhập chính xác tài khoản của bạn !");

            }
            if (usermodel.UserPassword != change.OldPassword)
            {
                return BadRequest("Mật khẩu cũ không đúng, vui lòng nhập lại !");
            }
            
            if(usermodel.UserPassword == change.UserPassword)
            {
                return BadRequest("Mật khẩu mới không được trùng với mật khẩu cũ !");
            }
            var Account = _mapper.Map<Object>(usermodel);

            usermodel.UserPassword = change.UserPassword;
            await _register.SaveChange();
            return Accepted(new Response { Data = usermodel, Message = "success", Status = 200 });
        }

        #region  Cần thì mở ra dùng: Xóa User, Cập nhật user
        // [HttpDelete("{id}")]
        // public async Task<ActionResult> DeleteUserAsync(string id)
        // {
        //     var user = await _register.GetUserID(id);
        //     if (user != null)
        //     {
        //         _register.DeleteUserID(user);
        //         await _register.SaveChange();
        //         return Accepted();
        //     }
        //     return NotFound();

        // }
        // [HttpGet("{id}")]
        // public async Task<ActionResult> GetByID(string id)
        // {
        //     var accountModel = await _register.GetUserID(id);
        //     return Ok(accountModel);
        // }


        // [HttpPut("{id}")]
        // public async Task<ActionResult> UpdateUser(string id, AccountCreate accountCreate)
        // {
        //     var accountModel = await _register.GetUserID(id);
        //     if(accountModel == null) return NotFound();
        //     _mapper.Map(accountCreate, accountModel);
        //     await _register.SaveChange();
        //     return Accepted();
        // }
        #endregion
    }
}