using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace UMD2.Models
{
    public class StatusVm
    {
        public int Id { get; set; }
        public string Message { get; set; }
        public bool Error { get; set; }
        public int ErrorCode { get; set; }
        public bool Result { get; set; }
        public bool SecondaryResult { get; set; }
        public string ResultMessage { get; set; }
    }
}