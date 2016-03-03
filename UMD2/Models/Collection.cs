using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace UMD2.Models
{
    public class Collection
    {
        public int Id { get; set; }
        public string Title { get; set; }
        //public DateTime Date { get; set; }
        public List<Media> Contents { get; set; }
    }
}