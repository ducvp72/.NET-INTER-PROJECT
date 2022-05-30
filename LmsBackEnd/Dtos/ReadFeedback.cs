using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace LmsBackEnd
{
    public class ReadFeedback {
 
        public string FeedbackID {get; set;}

        public string FeedbackName { get; set; }


        public string FeedbackDetail {get; set;}
        
        public DateTime ExpiredDate{get; set;}

        public string Ques1{get; set;}
        public string Ques2{get; set;}
        public string Ques3{get; set;}
        public string Ques4{get; set;}
        public string Ques5{get; set;}
    }
}