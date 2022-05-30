using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LmsBackEnd.Models
{
    public class ResultToken
    {
        public string ID { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public DateTime NgaySinh { get; set; }
        public string Phone { get; set; }
        public string UserName { get; set; }
        public string UserPassword { get; set; }

        #region  ConfirmPass Field
        // [Required(ErrorMessage ="Confirm Password is required")]
        // [Compare("UserPassword")]
        // [DataType(DataType.Password)]
        // [NotMapped]
        // public string ConfirmPassword{get;set;}
        #endregion
        public bool IsMailConfirmed { get; set; }

        public string GioiTinh { get; set; }

        public string UserRole { get; set; }

        public int LearningRank { get; set; }
        public string Token { get; set; }

        public ResultToken(
                string id,
                string name,
                string email,
                DateTime ngaySinh,
                string phone,
                string userName,
                string userPassword,
                bool isMailConfirmed,
                string gioiTinh,
                string userRole,
                int learningRank,
                string token)
        {
            ID = id;
            Name = name;
            Email = email;
            NgaySinh = ngaySinh;
            Phone = phone;
            UserName = userName;
            UserPassword = userPassword;
            IsMailConfirmed = isMailConfirmed;
            GioiTinh = gioiTinh;
            UserRole = userRole;
            LearningRank = learningRank;
            Token = token;
        }
    }
}
