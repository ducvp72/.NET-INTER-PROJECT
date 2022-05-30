using System;
using System.ComponentModel.DataAnnotations;

namespace LmsBackEnd.Dtos
{
    public class CreateUser
    {
        [Required(ErrorMessage ="Vui lòng nhập Name")]
        [MaxLength(50)]
        public string Name{get;set;}
  
        public string Email {get;set;}

        [Required]
        [DataType(DataType.DateTime)]
        public DateTime NgaySinh{get;set;}

        // [Phone]
        // [StringLength(11)]
        public string Phone {get;set;}

        [Required(ErrorMessage ="Username is required")]
        [StringLength(16,ErrorMessage ="Must be between 5 and 16 charaters",MinimumLength =5)]
        public string UserName{get;set;}

        [Required(ErrorMessage ="Password is required")]
        [StringLength(16,MinimumLength=8)]
        [DataType(DataType.Password)]
        public string UserPassword{get;set;}

        [Required(ErrorMessage ="Vui lòng nhập Role")]
        [MaxLength(50)]
        public string UserRole{get;set;}
        public string GioiTinh{get;set;}

    }
}