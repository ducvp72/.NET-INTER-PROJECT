using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace LmsBackEnd
{
    public class NotifyCreate
    {
        public string NotifyID {get; set;}

        public string NotifyName {get; set;}

        public string NotifyDetail {get; set;}

        [DefaultValue(false)]
        public bool IsConfirmed {get; set;} = false;

        [DefaultValue(true)]
        public bool IsOutDated {get; set;} = true;
    }
}