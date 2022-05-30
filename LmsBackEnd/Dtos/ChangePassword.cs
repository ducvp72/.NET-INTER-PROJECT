
using System.ComponentModel.DataAnnotations;

namespace LmsBackEnd
{
    public class ChangePassword
    {
        [Required(ErrorMessage ="Username is required")]
        [StringLength(16,ErrorMessage ="Must be between 5 and 16 charaters",MinimumLength =5)]
        public string UserName{get;set;}

        [Required(ErrorMessage ="Password is required")]
        [StringLength(16,MinimumLength=8)]
        [DataType(DataType.Password)]
        public string OldPassword{get;set;}

        [Required(ErrorMessage ="Password is required")]
        [StringLength(16,MinimumLength=8)]
        [DataType(DataType.Password)]
        public string UserPassword{get;set;}

        [Required(ErrorMessage ="Confirm Password is required")]
        [Compare("UserPassword")]
        [DataType(DataType.Password)]
        public string ConfirmPassword{get;set;}
    }
}