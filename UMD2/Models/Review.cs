using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace UMD2.Models
{
    public class Review
    {
        public int Id { get; set; }
        public string OwnerId { get; set; }
        public int MediaId { get; set; }
        public string OwnerName { get; set; }
        public string Content { get; set; }
        public int Score { get; set; }
        public DateTime DateCreated { get; set; }
        public List<Comment> Comments { get; set; }
        public bool IsActive { get; set; } 
    }
}