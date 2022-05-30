
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LmsBackEnd
{
    public class Forgotpass
    {
  
        [Display(Name = "Email Address")]
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage ="Invalid Email")]
        public string Email {get;set;}

        [Required(ErrorMessage ="Username is required")]
        [StringLength(16,ErrorMessage ="Must be between 5 and 16 charaters",MinimumLength =5)]
        public string UserName{get;set;}

    }
}