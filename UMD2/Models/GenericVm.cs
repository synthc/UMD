using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace UMD2.Models
{
    public class GenericVm
    {
        public int Id { get; set; }
        public int Int1 { get; set; }
        public int Int2 { get; set; }
        public float Float { get; set; }
        public double Double { get; set; }
        public string String1 { get; set; }
        public string String2 { get; set; }
        public bool Bool1 { get; set; }
        public bool Bool2 { get; set; }
        public Object Container { get; set; }
        public Object ReturnObj { get; set; }
    }
}