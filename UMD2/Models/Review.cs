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
        public string OwnerName { get; set; }
        public int MediaId { get; set; }
        public int Score { get; set; } //For sending back to client side
        public string Content { get; set; }
        public DateTime DateCreated { get; set; }
        public List<Comment> Comments { get; set; }
        public bool IsActive { get; set; }
    }
}