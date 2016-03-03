namespace UMD2.Migrations
{
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;
    using Models;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;
    using System.Security.Claims;
    internal sealed class Configuration : DbMigrationsConfiguration<UMD2.Models.ApplicationDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(UMD2.Models.ApplicationDbContext context)
        {
            var userStore = new UserStore<ApplicationUser>(context);
            var userManager = new ApplicationUserManager(userStore);

            var user = userManager.FindByName("admin");

            if (user == null)
            {
                user = new ApplicationUser
                {
                    UserName = "admin",
                    Email = "admin@admin.com",
                    MasterList = new List<Media>(),
                };

                userManager.Create(user, "Secret123!");
                userManager.AddClaim(user.Id, new Claim("Admin", "true"));
            }

            var user2 = userManager.FindByName("user");

            if (user2 == null)
            {
                user2 = new ApplicationUser
                {
                    UserName = "user",
                    Email = "user@user.com",
                    MasterList = new List<Media>(),
                };

                userManager.Create(user2, "Secret123!");
                userManager.AddClaim(user2.Id, new Claim("User", "true"));
            }

            var user3 = userManager.FindByName("denied");

            if (user3 == null)
            {
                user3 = new ApplicationUser
                {
                    UserName = "denied",
                    Email = "denied@401.com",
                    MasterList = new List<Media>(),
                };
            }

            userManager.Create(user3, "Secret123!");
            userManager.AddClaim(user3.Id, new Claim("Denied", "true"));

            Media[] media = new Media[]
            {
                new Movie
                {
                    Id = 1,
                    Title = "The Usual Suspects",
                    Description = "A sole survivor tells of the twisty events leading up to a horrific gun battle on a boat, which begin when five criminals meet at a seemingly random police lineup.",
                    CountryOfOrigin = "USA",
                    Language = "English",
                    IsAnimation = false,
                    ReleaseDate = new DateTime(1995, 9, 15),
                    DbDateAdded = DateTime.Now,
                    ThumbnailUrl = "http://ia.media-imdb.com/images/M/MV5BMzI1MjI5MDQyOV5BMl5BanBnXkFtZTcwNzE4Mjg3NA@@._V1_SX640_SY720_.jpg",
                    Genre = "Crime, Drama, Mystery",
                    Duration = 106,
                    Type = "movie",
                    IsActive = true,
                    Contributors = new List<Contributor>(),
                },
                new Movie
                {
                    Id = 2,
                    Title = "Abre Los Ojos",
                    Description = "A very handsome man finds the love of his life, but he suffers an accident and needs to have his face rebuilt by surgery after it is severely disfigured.",
                    CountryOfOrigin = "Spain",
                    Language = "Spanish",
                    IsAnimation = false,
                    ReleaseDate = new DateTime(1900, 1, 1),
                    DbDateAdded = DateTime.Now,
                    ThumbnailUrl = "http://ia.media-imdb.com/images/M/MV5BMTQ2OTk1NDU4MV5BMl5BanBnXkFtZTYwNTIzNjQ5._V1_UY268_CR3,0,182,268_AL_.jpg",
                    Genre = "Drama, Mystery, Romance",
                    Duration = 117,
                    Type = "movie",
                    IsActive = true,
                    Contributors = new List<Contributor>(),
                },
                new Movie
                {
                    Id = 3,
                    Title = "Marebito",
                    Description = "A fear-obsessed freelance cameraman (Shinya Tsukamoto) investigates an urban legend involving mysterious spirits that haunt the subways of Tokyo.",
                    CountryOfOrigin = "Japan",
                    Language = "Japanese",
                    IsAnimation = false,
                    ReleaseDate = new DateTime(1800, 1, 1),
                    DbDateAdded = DateTime.Now,
                    ThumbnailUrl = "http://ia.media-imdb.com/images/M/MV5BMjE0MTg0MjU5MF5BMl5BanBnXkFtZTcwNjQ2NTEzMQ@@._V1_UX182_CR0,0,182,268_AL_.jpg",
                    Genre = "Drama, Fantasy, Horror",
                    Duration = 92,
                    Type = "movie",
                    IsActive = true,
                    Contributors = new List<Contributor>(),
                },
                new Game
                {
                    Id = 4,
                    Title = "Yume Nikki",
                    CountryOfOrigin = "Japan",
                    Language = "Japanese",
                    Platforms = "PC",
                    Engine = "RPG Maker 2000",
                    ReleaseDate = new DateTime(1800, 1, 1),
                    DbDateAdded = DateTime.Now,
                    ThumbnailUrl = "http://pre01.deviantart.net/7623/th/pre/i/2013/167/e/c/yume_nikki_by_pyromaniac-d69d4c3.jpg",
                    Genre = "Exploration, Psycological",
                    StartDate = new DateTime(1800, 1, 1),
                    EndDate = new DateTime(1800, 1, 1),
                    Type = "game",
                    IsActive = true,
                    Contributors = new List<Contributor>(),
                },
                new Movie
                {
                    Id = 5,
                    Title = "Swimming with Sharks",
                    Description = "A young, naive Hollywood studio assistant finally turns the tables on his incredibly abusive producer boss.",
                    CountryOfOrigin = "USA",
                    Language = "English",
                    IsAnimation = false,
                    ReleaseDate = new DateTime(1995, 4, 21),
                    DbDateAdded = DateTime.Now,
                    ThumbnailUrl = "http://ia.media-imdb.com/images/M/MV5BMTYyNzQxMTY5NV5BMl5BanBnXkFtZTcwNjM2MDkyMQ@@._V1_UY268_CR3,0,182,268_AL_.jpg",
                    Genre = "Comedy, Crime",
                    Duration = 93,
                    Type = "movie",
                    IsActive = true,
                    Contributors = new List<Contributor>(),
                }
            };

            
            context.Media.AddOrUpdate(m => m.Title, media);
        }
    }
}


//var contributors = new Contributor[]
//{
//    new Contributor
//            {
//                Id = 1,
//                Roles = "Actor",
//                Surname = "Baldwin",
//                GivenName = "Stephen",
//                DoB = new DateTime(1966, 4, 12),
//                Nationality = "USA",
//                Description = "Stephen Baldwin was born on May 12, 1966 in Massapequa, Long Island, New York, USA as Stephen Andrew Baldwin. He is an actor and producer, known for The Usual Suspects (1995), The Young Riders (1989) and Born on the Fourth of July (1989). He has been married to Kennya Baldwin since June 10, 1990. They have two children.",
//            },
//            new Contributor
//            {
//                Id = 2,
//                Roles = "Actor",
//                Surname = "Byrne",
//                GivenName = "Gabriel",
//                DoB = new DateTime(1950, 5, 12),
//                Nationality = "Ireland",
//                Description = "Byrne was the first of six children, born in Dublin, Ireland. His father was a cooper and his mother a hospital worker. He was raised Catholic and educated by the Irish Christian Brothers. He spent five years of his childhood in a seminary training to be a Catholic priest. He later said, \"I spent five years in the seminary and I suppose it was ...",
//            },
//            new Contributor
//            {
//                Id = 3,
//                Roles = "Director",
//                Surname = "Singer",
//                GivenName = "Bryan",
//                DoB = new DateTime(1965, 9, 17),
//                Nationality = "USA",
//                Description = "Bryan Singer was born on September 17, 1965 in New York City, New York, USA as Bryan Jay Singer. He is a producer and director, known for House M.D. (2004), The Usual Suspects (1995) and X-Men 2 (2003).",
//            },
//            new Contributor
//            {
//                Id = 4,
//                Roles = "Writer",
//                Surname = "McQuarrie",
//                GivenName = "Christopher",
//                DoB = new DateTime(1968, 1, 1),
//                Nationality = "USA",
//                Description = "Christopher McQuarrie was born in 1968 in Princeton, New Jersey, USA. He is a writer and producer, known for Mission: Impossible - Rogue Nation (2015), The Usual Suspects (1995) and Edge of Tomorrow (2014). He is married to Heather McQuarrie.",
//            }
//};

//var clist = contributors.ToList();

//context.Contributors.AddOrUpdate(c => c.Surname, contributors);
//context.SaveChanges();
