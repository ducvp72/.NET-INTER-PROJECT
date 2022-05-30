using System;
using System.ComponentModel.DataAnnotations;

namespace LmsBackEnd.Dtos
{
    public class UserchangeInfo
    {
        [MaxLength(50)]
        public string Name{get;set;}

        [DataType(DataType.DateTime)]
        public DateTime NgaySinh{get;set;}
        public string Phone {get;set;}
        public string GioiTinh{get;set;}
    }
}