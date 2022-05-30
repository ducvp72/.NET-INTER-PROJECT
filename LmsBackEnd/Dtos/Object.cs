
using System;
using System.ComponentModel.DataAnnotations;

namespace LmsBackEnd 
{
    public class Object
    {
        [Required]
        [MaxLength(8)]
        public string ID {get;set;}

        [Required]
        [MaxLength(50)]
        public string Name{get;set;}
  
        [Display(Name = "Email Address")]
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage ="Invalid Email")]
        public string Email {get;set;}

        [Required]
        [DataType(DataType.DateTime)]
        public DateTime NgaySinh{get;set;}

        [Phone]
        [StringLength(11)]
        public string Phone {get;set;}

        [Required(ErrorMessage ="Username is required")]
        [StringLength(16,ErrorMessage ="Must be between 5 and 16 charaters",MinimumLength =5)]
        public string UserName{get;set;}

        [Required(ErrorMessage ="Password is required")]
        [StringLength(16,MinimumLength=8)]
        [DataType(DataType.Password)]
        public string UserPassword{get;set;}
        public bool IsMailConfirmed{get;set;} = false;

        public string GioiTinh{get;set;}

        public string UserRole{get;set;}

        public int LearningRank{get;set;}
 
    }
}