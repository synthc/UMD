using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;
using UMD2.Models;

namespace UMD2.Models
{
    [KnownType(typeof(Media))]
    [KnownType(typeof(Game))]

    public class Game : Media
    {
        public List<Studio> Studios { get; set; }
        public List<Publisher> Publishers { get; set; }
        public string Language { get; set; }
        public int AveragePlaytime { get; set; }
        public string Platforms { get; set; }
        public string Engine { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int Playtime { get; set; }
    }
}