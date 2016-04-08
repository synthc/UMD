using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace UMD2.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTime DateCreated { get; set; }
        public bool IsActive { get; set; }
    }
}