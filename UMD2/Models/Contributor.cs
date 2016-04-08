using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace UMD2.Models
{
    public class Contributor
    {
        public int Id { get; set; }
        public string Roles { get; set; }
        public string Surname { get; set; }
        public string GivenName { get; set; }
        public DateTime DoB { get; set; }
        public string Nationality { get; set; }
        public string ThumbnailUrl { get; set; }
        public string WebsiteUrl { get; set; }
        public string Description { get; set; }
        public string CurrentAffiliation { get; set; }
        public string PastAffiliations { get; set; }
        public List<Studio> Studios { get; set; }
        public List<Media> Contributions { get; set; }
        public List<Comment> Comments { get; set; }
        public bool IsActive { get; set; }
    }
}