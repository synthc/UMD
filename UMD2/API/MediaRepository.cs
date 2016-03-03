using Generic_Repositories.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using UMD2.Models;

namespace UMD.API
{
    public class MediaRepository : GenericRepository, IMediaRepository
    {
        ApplicationDbContext db = new ApplicationDbContext();

        private IGenericRepository repo;

        public MediaRepository(IGenericRepository repo)
        {
            this.repo = repo;
        }

        //Get all entries from the database:
        public ICollection<Media> GetMedia()
        {
            return repo.Query<Media>().ToList();
        }

        //Get a single entry from the database:
        public Media GetMediaById(int id)
        {
            var result = repo.Query<Media>().Where(m => m.Id == id).Include(m => m.Contributors).Include(m => m.UserMedias).FirstOrDefault();
            return result;
        }

        //Get a single user from the database:
        public ApplicationUser GetUserById(string userId)
        {
            return repo.Query<ApplicationUser>().Where(u => u.Id == userId).Include(u => u.MasterList.Select(m => m.UserMedias)).FirstOrDefault();
        }

        //Add an entry to a user's list:
        public StatusVm ChangeList(ChangeListVm vm)
        {
            StatusVm returnObj = new StatusVm();
            var user = repo.Query<ApplicationUser>().Where(u => u.Id == vm.UserId).Include(u => u.MasterList).FirstOrDefault();
            var media = repo.Query<Media>().Where(m => m.Id == vm.MediaId).Include(m => m.UserMedias).FirstOrDefault();

            if (vm.Mode == "add")
            {
                if (user.MasterList.Contains(media))
                {
                    returnObj.Error = true;
                    returnObj.Message = "This media is already in the user's masterlist.";
                }
                else
                {
                    if (media.UserMedias.Count == 0)
                    {
                        media.UserMedias = new List<UserMedia>();
                    }

                    var deactivated = media.UserMedias.Where(u => u.OwnerId == vm.UserId).FirstOrDefault();

                    if (deactivated != null)
                    {
                        deactivated.IsActive = true;
                    }
                    else
                    {
                        media.UserMedias.Add(new UserMedia
                        {
                            OwnerId = vm.UserId,
                            MediaId = vm.MediaId,
                            AddedToList = DateTime.Now,
                            StartDate = new DateTime(1800, 1, 2),
                            EndDate = new DateTime(1800, 1, 2),
                            IsActive = false,
                        });
                    }

                    user.MasterList.Add(media);
                    returnObj.Error = false;
                    returnObj.Message = "Success.";
                }
            }
            else if (vm.Mode == "remove")
            {
                media.UserMedias.Where(u => u.OwnerId == vm.UserId).Where(u => u.MediaId == vm.MediaId).FirstOrDefault().IsActive = false;
                user.MasterList.Remove(media);
                returnObj.Error = false;
            }

            repo.SaveChanges();
            return returnObj;
        }

        //Check a user's masterlist for a specific entry:
        public StatusVm CheckMasterlist(ChangeListVm vm)
        {
            StatusVm returnObj = new StatusVm();
            var user = repo.Query<ApplicationUser>().Where(u => u.Id == vm.UserId).Include(u => u.MasterList).FirstOrDefault();
            if (user != null)
            {
                var media = repo.Find<Media>(vm.MediaId);

                if (user.MasterList.Contains(media))
                {
                    returnObj.Result = true;
                }
                else
                {
                    returnObj.Result = false;
                }
            }
            else
            {
                returnObj.Error = true;
                returnObj.Message = "Authentication error.";
            }

            return returnObj;
        }

        //Update user-specific list entry data:
        public StatusVm UpdateUserMedia(UserMedia userMedia)
        {
            StatusVm returnObj = new StatusVm();
            var media = repo.Query<Media>().Where(m => m.Id == userMedia.MediaId).Include(m => m.UserMedias).FirstOrDefault();
            var original = media.UserMedias.Where(u => u.OwnerId == userMedia.OwnerId).FirstOrDefault();

            //Calculate average rating:
            if (userMedia.Rating != original.Rating)
            {
                //If new rating:
                if (original.Rating == 0)
                {
                    media.AverageRating = ((media.AverageRating * media.RatingCount) + userMedia.Rating) / (media.RatingCount + 1);
                    media.RatingCount++;
                }
                //If updating rating:
                else
                {
                    int divisor = (media.RatingCount - 1);
                    float newAverage = 0;

                    //Undo original rating:
                    if (divisor != 0)
                    {
                        newAverage = ((media.AverageRating * media.RatingCount) - original.Rating) / divisor;
                    }
                    //if divisor == 0, the previous rating was 0

                    //Add new rating:
                    newAverage = ((newAverage * divisor) + userMedia.Rating) / (divisor + 1);
                    //Apply to media:
                    media.AverageRating = newAverage;
                }
            }

            original.Rating = userMedia.Rating;
            original.Status = userMedia.Status;
            original.StartDate = userMedia.StartDate;
            original.EndDate = userMedia.EndDate;
            original.Tags = userMedia.Tags;
            original.ReValue = userMedia.ReValue;
            original.ReCount = userMedia.ReCount;
            original.IsActive = true;

            repo.SaveChanges();
            return returnObj;
        }

        //Add a contributor to a work:
        public void AddContributor(ContributorVm vm)
        {
            Media media = repo.Query<Media>().Where(m => m.Id == vm.MediaId).Include(m => m.Contributors).FirstOrDefault();

            media.Contributors.Add(vm.Contributor);
            repo.SaveChanges();
        }

        //Remove a contributor from a work:
        public void RemoveContributor(ContributorVm vm)
        {
            Media media = repo.Query<Media>().Where(m => m.Id == vm.MediaId).Include(m => m.Contributors).FirstOrDefault();
            Contributor contributor = repo.Find<Contributor>(vm.ContributorId);

            media.Contributors.Remove(contributor);
            repo.SaveChanges();
        }

        //Hard delete an entry from the database:
        public void DeleteMedia(int id)
        {
            repo.Delete<Media>(id);
            repo.SaveChanges();
        }

        //Search the database and return results:
        public QueryVm Search(QueryVm query)
        {
            QueryVm returnObj = new QueryVm();
            IQueryable<Media> results = Enumerable.Empty<Media>().AsQueryable();
            query.SearchFor = query.SearchFor.ToLower();
            query.Query = query.Query.ToLower();

            //IF ALL:
            if (query.SearchFor == "all")
            {
                if (query.SearchBy == "Any")
                {
                    results = (from w in db.Media.Include(m => m.Contributors)
                               where w.Title.ToLower().Contains(query.Query)
                               || w.Genre.ToLower().Contains(query.Query)
                               select w);

                    var matches = results.ToList();
                    bool quit = false;

                    foreach (Media media in db.Media.Include(m => m.Contributors))
                    {
                        int i = 0;
                        quit = false;
                        while (!quit && i < media.Contributors.Count())
                        {
                            if (media.Contributors[i].Surname.ToLower().Contains(query.Query) || media.Contributors[i].GivenName.ToLower().Contains(query.Query))
                            {
                                matches.Add(media);
                                quit = true;
                            }
                            i++;
                        }
                    }

                    returnObj.Results = matches;
                }
                else if (query.SearchBy == "Title")
                {
                    results = (from w in db.Media.Include(m => m.Contributors)
                               where w.Title.ToLower().Contains(query.Query)
                               select w);

                    returnObj.Results = results.ToList();
                }
                else if (query.SearchBy == "Person")
                {
                    var matches = results.ToList();
                    bool quit = false;

                    foreach (Media media in db.Media.Include(m => m.Contributors))
                    {
                        int i = 0;
                        quit = false;
                        while (!quit && i < media.Contributors.Count())
                        {
                            if (media.Contributors[i].Surname.ToLower().Contains(query.Query) || media.Contributors[i].GivenName.ToLower().Contains(query.Query))
                            {
                                matches.Add(media);
                                quit = true;
                            }
                            i++;
                        }
                    }

                    returnObj.Results = matches;
                }
                else if (query.SearchBy == "Genre")
                {
                    results = (from w in db.Media.Include(m => m.Contributors)
                               where w.Genre.ToLower().Contains(query.Query)
                               select w);

                    returnObj.Results = results.ToList();
                }
            }
            //IF NOT ALL BUT ANY:
            else if (query.SearchBy == "Any")
            {
                results = (from w in db.Media.Include(m => m.Contributors)
                           where w.Type == query.SearchFor
                           && w.Title.ToLower().Contains(query.Query)
                           || w.Genre.ToLower().Contains(query.Query)
                           select w);

                var matches = results.ToList();
                bool quit = false;

                foreach (Media media in db.Media.Include(m => m.Contributors))
                {
                    int i = 0;
                    quit = false;
                    while (!quit && i < media.Contributors.Count())
                    {
                        if (media.Contributors[i].Surname.ToLower().Contains(query.Query) || media.Contributors[i].GivenName.ToLower().Contains(query.Query))
                        {
                            matches.Add(media);
                            quit = true;
                        }
                        i++;
                    }
                }

                returnObj.Results = matches;
            }
            //IF NOT ALL & NOT ANY:
            else if (query.SearchBy == "Title")
            {
                results = (from w in db.Media.Include(m => m.Contributors)
                           where w.Type == query.SearchFor
                           && w.Title.ToLower().Contains(query.Query)
                           select w);

                returnObj.Results = results.ToList();
            }
            else if (query.SearchBy == "Person")
            {
                var typeFilter = (from w in db.Media.Include(m => m.Contributors)
                                  where w.Type == query.SearchFor
                                  select w);

                var matches = results.ToList();
                bool quit = false;

                foreach (Media media in typeFilter)
                {
                    int i = 0;
                    quit = false;
                    while (!quit && i < media.Contributors.Count())
                    {
                        if (media.Contributors[i].Surname.ToLower().Contains(query.Query) || media.Contributors[i].GivenName.ToLower().Contains(query.Query))
                        {
                            matches.Add(media);
                            quit = true;
                        }
                        i++;
                    }
                }

                returnObj.Results = matches;
            }
            else if (query.SearchBy == "Genre")
            {
                results = (from w in db.Media.Include(m => m.Contributors)
                           where w.Type == query.SearchFor
                           && w.Genre.ToLower().Contains(query.Query)
                           select w);

                returnObj.Results = results.ToList();
            }

            return returnObj;
        }

        //Add an entry to the database:
        public Movie AddMedia(MediaVm mediaVm)
        {
            if (mediaVm.Type == "movie")
            {
                //put this stuff in a utility method
                if (mediaVm.Id == 0)
                {
                    Movie movie = new Movie
                    {
                        Title = mediaVm.Title,
                        ReleaseDate = mediaVm.ReleaseDate,
                        DbDateAdded = DateTime.Now,
                        Description = mediaVm.Description,
                        CountryOfOrigin = mediaVm.CountryOfOrigin,
                        Genre = mediaVm.Genre,
                        ThumbnailUrl = mediaVm.ThumbnailUrl,
                        Duration = mediaVm.Duration,
                        IsAnimation = mediaVm.IsAnimation,
                        Language = mediaVm.Language,
                        Type = mediaVm.Type,
                        IsActive = mediaVm.IsActive,
                        Contributors = mediaVm.Contributors,
                    };
                    repo.Add<Movie>(movie);
                    repo.SaveChanges();
                    return movie;
                }
                else
                {
                    if (!mediaVm.DeleteRestore)
                    {
                        var original = repo.Query<Movie>().Where(m => m.Id == mediaVm.Id).FirstOrDefault();
                        original.Title = mediaVm.Title;
                        original.ReleaseDate = mediaVm.ReleaseDate;
                        original.Description = mediaVm.Description;
                        original.CountryOfOrigin = mediaVm.CountryOfOrigin;
                        original.Genre = mediaVm.Genre;
                        original.ThumbnailUrl = mediaVm.ThumbnailUrl;
                        original.Duration = mediaVm.Duration;
                        original.IsAnimation = mediaVm.IsAnimation;
                        original.Language = mediaVm.Language;
                        original.Type = mediaVm.Type;
                        original.IsActive = mediaVm.IsActive;

                        //Depricated by the AddContributor method:
                        //if (mediaVm.ContributorCreated)
                        //{
                        //    original.Contributors = mediaVm.Contributors;
                        //}

                        repo.SaveChanges();
                        return original;
                    }
                    else
                    {
                        var original = repo.Query<Movie>().Where(m => m.Id == mediaVm.Id).FirstOrDefault();
                        if (original.IsActive)
                        {
                            original.IsActive = false;
                            repo.SaveChanges();
                            return original;
                        }
                        else
                        {
                            original.IsActive = true;
                            repo.SaveChanges();
                            return original;
                        }
                    }

                }
            }
            else
            {
                return null;
            }
            //else if (mediaVm.Type == "series")
            //{

            //}
            //else if (mediaVm.Type == "game")
            //{

            //}
            //else if (mediaVm.Type == "book")
            //{

            //}
            //else if (mediaVm.Type == "music")
            //{

            //}
            //else if (mediaVm.Type == "art")
            //{

            //}
        }

        //Seed contributors:
        public void DebugSeed()
        {
            Movie movie = repo.Query<Movie>().Where(m => m.Id == 1).Include(m => m.Contributors).FirstOrDefault();
            Movie sharks = repo.Query<Movie>().Where(m => m.Title == "Swimming with Sharks").Include(m => m.Contributors).FirstOrDefault();

            List<Contributor> toSeed = new List<Contributor>
            {
                new Contributor
                {
                    Id = 1,
                    Roles = "Actor",
                    Surname = "Baldwin",
                    GivenName = "Stephen",
                    DoB = new DateTime(1966, 4, 12),
                    Nationality = "USA",
                    Description = "Stephen Baldwin was born on May 12, 1966 in Massapequa, Long Island, New York, USA as Stephen Andrew Baldwin. He is an actor and producer, known for The Usual Suspects (1995), The Young Riders (1989) and Born on the Fourth of July (1989). He has been married to Kennya Baldwin since June 10, 1990. They have two children.",
                },
                new Contributor
                {
                    Id = 2,
                    Roles = "Actor",
                    Surname = "Byrne",
                    GivenName = "Gabriel",
                    DoB = new DateTime(1950, 5, 12),
                    Nationality = "Ireland",
                    Description = "Byrne was the first of six children, born in Dublin, Ireland. His father was a cooper and his mother a hospital worker. He was raised Catholic and educated by the Irish Christian Brothers. He spent five years of his childhood in a seminary training to be a Catholic priest. He later said, \"I spent five years in the seminary and I suppose it was ...",
                },
                new Contributor
                {
                    Id = 3,
                    Roles = "Director",
                    Surname = "Singer",
                    GivenName = "Bryan",
                    DoB = new DateTime(1965, 9, 17),
                    Nationality = "USA",
                    Description = "Bryan Singer was born on September 17, 1965 in New York City, New York, USA as Bryan Jay Singer. He is a producer and director, known for House M.D. (2004), The Usual Suspects (1995) and X-Men 2 (2003).",
                },
                new Contributor
                {
                    Id = 4,
                    Roles = "Writer",
                    Surname = "McQuarrie",
                    GivenName = "Christopher",
                    DoB = new DateTime(1968, 1, 1),
                    Nationality = "USA",
                    Description = "Christopher McQuarrie was born in 1968 in Princeton, New Jersey, USA. He is a writer and producer, known for Mission: Impossible - Rogue Nation (2015), The Usual Suspects (1995) and Edge of Tomorrow (2014). He is married to Heather McQuarrie.",
                },
                new Contributor
                {
                    Id = 5,
                    Roles = "Actor",
                    Surname = "Spacey",
                    GivenName = "Kevin",
                    DoB = new DateTime(1959, 7, 26),
                    Nationality = "USA",
                    Description = "As enigmatic as he is talented, Kevin Spacey has always kept the details of his private life closely guarded. As he explained in a 1998 interview with the London Evening Standard, \"the less you know about me, the easier it is to convince you that I am that character on screen.",
                }
            };

            List<Contributor> spacey = new List<Contributor>
            {
                toSeed[4]
            };

            movie.Contributors = toSeed;
            sharks.Contributors = spacey;
            repo.SaveChanges();
        }
    }
}