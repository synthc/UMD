using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace UMD2.Models
{
    public class ReviewVm
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public int MediaId { get; set; }
        public string UserId { get; set; }
        public List<Review> Reviews { get; set; }
    }
}