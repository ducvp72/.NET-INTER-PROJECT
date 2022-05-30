
using System.ComponentModel.DataAnnotations;

namespace LmsBackEnd
{
    public class ForgetPass
    {
        [StringLength(16,MinimumLength=8)]
        [DataType(DataType.Password)]
        public string UserPassword{get;set;}

       
        [DataType(DataType.Password)]
        public string ConfirmPassword{get;set;}
    }
}