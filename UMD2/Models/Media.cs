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
        public int Flags { get; set; } //Augmented when a user flags a media for deletion
        public bool IsPublic { get; set; }
        public List<UserMedia> UserMedias { get; set; }
        public List<ApplicationUser> InListOf { get; set; } //unused
        public DateTime DbDateAdded { get; set; }
        public string Title { get; set; }
        public DateTime ReleaseDate { get; set; }
        public string Description { get; set; }
        public string ContentRating { get; set; }
        public List<Contributor> Contributors { get; set; }
        public List<Collection> Collections { get; set; }
        public string CountryOfOrigin { get; set; }
        public string ThumbnailUrl { get; set; }
        public string Genre { get; set; }
        public float AverageRating { get; set; }
        public int RatingCount { get; set; }
        public List<Review> Reviews { get; set; }
    }
}