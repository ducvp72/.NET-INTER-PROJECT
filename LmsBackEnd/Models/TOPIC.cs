using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace LmsBackEnd
{
    public class TOPIC {
        
        [Key]
        public string TopicID {get; set;}

        public string TopicName {get; set;}

        public string TopicDetail {get; set;}

        [DefaultValue(false)]
        public bool IsOutDated {get; set;}

        public ICollection<COMMENT> COMMENTS { get; set; }
    }
}