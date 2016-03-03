using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace UMD2.Models
{
    [KnownType(typeof(Media))]
    [KnownType(typeof(Movie))]

    public class Media
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public bool IsActive { get; set; }
        public bool IsPublic { get; set; }
        public List<UserMedia> UserMedias { get; set; }
        public List<ApplicationUser> InListOf { get; set; } //unused (may be useful to define many-to-many relationship)
        public DateTime DbDateAdded { get; set; }
        public string Title { get; set; }
        public DateTime ReleaseDate { get; set; }
        public string Description { get; set; }
        public string ContentRating { get; set; } //e.g. PG-13
        public List<Contributor> Contributors { get; set; }
        public List<Collection> Collections { get; set; }
        public string CountryOfOrigin { get; set; }
        public string ThumbnailUrl { get; set; }
        public string Genre { get; set; }
        public float AverageRating { get; set; }
        public int RatingCount { get; set; }
        public List<Review> Reviews { get; set; }
        //public DateTime UserDateAdded { get; set; }
        //public string Status { get; set; }
        //public int Rating { get; set; }
        //public List<string> Tags { get; set; }
        //public int ReValue { get; set; }
        //public int ReCount { get; set; }
    }
}