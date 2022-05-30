using System;
using System.ComponentModel.DataAnnotations;

namespace LmsBackEnd.Dtos
{
    public class ChangeUserInfo
    {
        [MaxLength(50)]
        [Required(ErrorMessage ="Vui lòng nhập Name")]
        public string Name{get;set;}

        [Required]
        [DataType(DataType.DateTime)]
        public DateTime NgaySinh{get;set;}

        // [Phone]
        // [StringLength(11)]
        public string Phone {get;set;}

        [Required(ErrorMessage ="Password is required")]
        [StringLength(16,MinimumLength=8)]
        [DataType(DataType.Password)]
        public string UserPassword{get;set;}
        public string GioiTinh{get;set;}

        [Required(ErrorMessage ="Vui lòng nhập Role")]
        [MaxLength(50)]
        public string UserRole{get;set;}

        public int LearningRank{get;set;}

    }
}