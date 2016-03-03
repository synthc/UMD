using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;
using UMD2.Models;

namespace UMD2.Models
{
    [KnownType(typeof(Media))]
    [KnownType(typeof(Movie))]

    public class Movie : Media
    {
        public List<Studio> Studios { get; set; }
        public int Duration { get; set; }
        public bool IsAnimation { get; set; }
        public string Language { get; set; }
        //public int Watchtime { get; set; }
    }
}