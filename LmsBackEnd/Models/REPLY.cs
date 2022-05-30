using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace LmsBackEnd
{
    public class REPLY {
        
        [Key]
        public int CommentID {get; set;}

        [Key]
        public int ReplyCommentID {get; set;}
    }
}
