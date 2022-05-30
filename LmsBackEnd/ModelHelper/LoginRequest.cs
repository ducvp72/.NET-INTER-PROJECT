using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace LmsBackEnd.Models
{
    public class LoginRequest
    {
        public string userName { get; set; }

        public string password { get; set; }

        //[Display(Name = "Nhớ tài khoản")]
        //public bool rememberAccount { get; set; }

        //public string returnURL { get; set; }
    }
}
