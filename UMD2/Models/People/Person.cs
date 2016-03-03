using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace UMD2.Models
{
    public class Person
    {
        public int Id { get; set; }
        public string Surname { get; set; }
        public string GivenName { get; set; }
        public DateTime DoB { get; set; }
        public string Nationality { get; set; }
        public string WebsiteUrl { get; set; }
        public string ProfileUrl { get; set; }
        public string Description { get; set; }
        public List<Media> Contributions { get; set; }
    }
}