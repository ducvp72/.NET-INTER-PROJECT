using Microsoft.Extensions.Configuration;
using LmsBackEnd.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace LmsBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly LmsContext _context;
        private readonly IConfiguration _config;
        public LoginController(LmsContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (request.userName == "" || request.password == "")
                return BadRequest("Vui lòng nhập đầy đủ tài khoản mật khẩu!");

            var account = await _context.ACCOUNTs.FirstOrDefaultAsync(e => e.UserName == request.userName);

            if (account == null || !account.IsMailConfirmed)
                return BadRequest("Chưa xác nhận tài khoản!");

            if (account.UserPassword != request.password)
                return BadRequest("Không đúng tài khoản hoặc mật khẩu!");

            var claims = new[]
             {
                new Claim(ClaimTypes.Email, account.Email),
                new Claim(ClaimTypes.GivenName, account.UserName)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Tokens:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(_config["Tokens:Issuer"],
                _config["Tokens:Issuer"],
                claims,
                expires: DateTime.Now.AddHours(3),
                signingCredentials: creds);

            var result = new ResultToken(
                account.ID,
                account.Name,
                account.Email,
                account.NgaySinh,
                account.Phone,
                account.UserName,
                account.UserPassword,
                account.IsMailConfirmed,
                account.GioiTinh,
                account.UserRole,
                account.LearningRank,
                new JwtSecurityTokenHandler().WriteToken(token));

            return Ok(result);
        }
    }
}
