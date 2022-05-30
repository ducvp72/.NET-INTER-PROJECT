using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LmsBackEnd.ModelHelper
{
    public class StudentInfo
    {
        public string StudentID { get; set; }
        public string Name { get; set; }
        public DateTime NgaySinh { get; set; }
        public string GioiTinh { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public int Score1 { get; set; }
        public int Score2 { get; set; }
        public int AvgScore { get; set; }
    }
}
