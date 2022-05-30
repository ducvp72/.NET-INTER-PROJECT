
using System;
using System.Collections.Generic;

namespace LmsBackEnd
{
    public class MailModel
    {
        public List<String> ToMails { get; set; } = new List<string>();
        public string Subject { get; set; } = "";
        public string Body { get; set; } = "";
        public bool IsBodyHtml { get; set; } = true;
        public List<string> Attachments { get; set; } = new List<string>();
    }
}