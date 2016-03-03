using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using UMD2.Models;

namespace UMD2.Models
{
    //This model must have all properties from all media child models
    public class MediaVm
    {
        //VM properties:
        //public int Year { get; set; }
        //public int Month { get; set; }
        //public int Day { get; set; }
        public bool DeleteRestore { get; set; }
        //Parent properties:
        public int Id { get; set; }
        public string Type { get; set; }
        public bool IsActive { get; set; }
        public bool IsPublic { get; set; }
        public bool ContributorCreated { get; set; }
        //public DateTime DbDateAdded { get; set; }
        public string Title { get; set; }
        public DateTime ReleaseDate { get; set; }
        public string Description { get; set; }
        public List<Contributor> Contributors { get; set; }
        public List<Collection> Collections { get; set; }
        public string CountryOfOrigin { get; set; }
        public string ThumbnailUrl { get; set; }
        public string PageUrl { get; set; }
        public string Genre { get; set; }
        public List<Review> Reviews { get; set; }
        //public DateTime UserDateAdded { get; set; }
        public string Status { get; set; }
        public int Rating { get; set; }
        public List<string> Tags { get; set; }
        public int ReValue { get; set; }
        public int ReCount { get; set; }
        //Movie properties:
        public List<Studio> Studios { get; set; }
        public int Duration { get; set; }
        public bool IsAnimation { get; set; }
        public string Language { get; set; }
        public int Watchtime { get; set; }
        //Series properties:

        //Game properties:
        public List<Publisher> Publishers { get; set; }
        public int AveragePlaytime { get; set; }
        public string Platforms { get; set; }
        public string Engine { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int Playtime { get; set; }


    }
}