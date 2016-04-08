using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace UMD2.Models
{
    public class UserMedia
    {
        public int Id { get; set; }
        public string OwnerId { get; set; }
        public int MediaId { get; set; }
        public int Rating { get; set; }
        public Review Review { get; set; }
        public List<Comment> Comments { get; set; }
        public string Status { get; set; }
        public int WatchTime { get; set; }
        public DateTime AddedToList { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Tags { get; set; }
        public int ReValue { get; set; }
        public int ReCount { get; set; }
        public bool IsActive { get; set; }
    }
}