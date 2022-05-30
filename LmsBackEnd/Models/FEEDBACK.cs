using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace LmsBackEnd
{
    public class FEEDBACK {
        
        [Key]
        public string FeedbackID {get; set;}
        
        [MaxLength(255)]
        public string FeedbackName {get; set;}

        [MaxLength(255)]
        public string FeedbackDetail {get; set;}
        
        [Required]
        [DataType(DataType.DateTime)]
        public DateTime ExpiredDate{get; set;}

        public string Ques1{get; set;}
        public string Ques2{get; set;}
        public string Ques3{get; set;}
        public string Ques4{get; set;}
        public string Ques5{get; set;}
        public ICollection<FEEDBACKATTEMP> FeedbackAttemps { get; set; }

    }
}