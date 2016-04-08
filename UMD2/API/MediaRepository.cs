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
            return repo.Query<Media>().Where(m => m.Id == id).Include(m => m.Contributors).Include(m => m.UserMedias).Include(m => m.Reviews).FirstOrDefault();
        }

        //Get a single contributor from the database:
        public Contributor GetContributorById(int id)
        {
            return repo.Query<Contributor>().Where(c => c.Id == id).Include(c => c.Contributions).FirstOrDefault();
        }

        //Get a single user from the database:
        public ApplicationUser GetUserById(string userId)
        {
            return repo.Query<ApplicationUser>().Where(u => u.Id == userId).Include(u => u.MasterList.Select(m => m.UserMedias)).FirstOrDefault();
        }

        //Add, update, or remove an entry in a user's list:
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

                    //If userMedia exists but is inactive, set it active:
                    var deactivated = media.UserMedias.Where(u => u.OwnerId == vm.UserId).FirstOrDefault();
                    if (deactivated != null)
                    {
                        deactivated.IsActive = true;
                    }
                    //Otherwise add a new UserMedia:
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
                var media = repo.Query<Media>().Where(m => m.Id == vm.MediaId).Include(m => m.Reviews).FirstOrDefault();
                var review = media.Reviews.Where(r => r.OwnerName == GetUserById(vm.UserId).UserName).FirstOrDefault();
                //var userMedia = media.UserMedias.Where(u => u.OwnerId == vm.UserId).FirstOrDefault();

                if (user.MasterList.Contains(media))
                {
                    returnObj.Result = true; //has media in masterlist
                    returnObj.SecondaryResult = false; //has written a review for media

                    //Check if the user has written a review for this entry:
                    if (review != null)
                    {
                        returnObj.SecondaryResult = true;
                    }
                    else
                    {
                        returnObj.SecondaryResult = false;
                    }
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
            Media media = repo.Query<Media>().Where(m => m.Id == userMedia.MediaId).Include(m => m.UserMedias).Include(m => m.Reviews).FirstOrDefault();
            UserMedia original = media.UserMedias.Where(u => u.OwnerId == userMedia.OwnerId).FirstOrDefault();

            //Calculate average rating:
            this.UpdateRating(media, original, userMedia);

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

        //Edit a contributor:
        public void EditContributor(Contributor contributor)
        {
            Contributor original = repo.Query<Contributor>().Where(c => c.Id == contributor.Id).Include(c => c.Contributions).FirstOrDefault();

            original.Roles = contributor.Roles;
            original.Surname = contributor.Surname;
            original.GivenName = contributor.GivenName;
            original.DoB = contributor.DoB;
            original.Nationality = contributor.Nationality;
            original.ThumbnailUrl = contributor.ThumbnailUrl;
            original.WebsiteUrl = contributor.WebsiteUrl;
            original.Description = contributor.Description;
            original.CurrentAffiliation = contributor.CurrentAffiliation;
            original.PastAffiliations = contributor.PastAffiliations;
            original.Studios = contributor.Studios;
            original.Comments = contributor.Comments;
            original.IsActive = contributor.IsActive;

            //Update contributions without creating duplicate media objects:
            original.Contributions.Clear();
            foreach (Media media in contributor.Contributions)
            {
                original.Contributions.Add(repo.Find<Media>(media.Id));
            }

            repo.SaveChanges();
        }

        //Delete a contributor:
        public void DeleteContributor(GenericVm vm)
        {
            Contributor contributor = repo.Find<Contributor>(vm.Int1);

            if (vm.String1 == "soft")
            {
                if (contributor.IsActive)
                {
                    contributor.IsActive = false;
                }
                else
                {
                    contributor.IsActive = true;
                }
            }
            else
            {
                repo.Delete<Contributor>(contributor.Id);
            }

            repo.SaveChanges();
        }

        //Add a review:
        public StatusVm AddReview(Review vm)
        {
            StatusVm returnObj = new StatusVm();
            Media media = repo.Query<Media>().Where(m => m.Id == vm.MediaId).Include(m => m.UserMedias).Include(m => m.Reviews).FirstOrDefault();
            UserMedia userMedia = media.UserMedias.Where(u => u.OwnerId == vm.OwnerId).FirstOrDefault();
            ApplicationUser user = GetUserById(vm.OwnerId);
            int score;

            //Determine whether the user set a new rating on the review page and update accordingly:
            if (vm.Score != 0)
            {
                score = vm.Score;

                //Update average rating:
                UserMedia newRatingContainer = new UserMedia
                {
                    Rating = vm.Score
                };
                this.UpdateRating(media, userMedia, newRatingContainer);

                //Old rating was needed to calculate new average rating above; therefore this is updated here
                userMedia.Rating = vm.Score;
            }
            else
            {
                score = userMedia.Rating;
            }

            //If new review:
            if (userMedia.Review == null)
            {
                Review reviewToAdd = new Review
                {
                    Content = vm.Content,
                    OwnerId = vm.OwnerId,
                    MediaId = vm.MediaId,
                    OwnerName = user.UserName,
                    Score = score,
                    DateCreated = DateTime.Now,
                    IsActive = true,
                };

                if (media.Reviews.Count() == 0)
                {
                    media.Reviews = new List<Review>();
                }

                userMedia.Review = reviewToAdd;
                media.Reviews.Add(reviewToAdd);
            }
            //If editing review:
            else
            {
                userMedia.Review.Content = vm.Content;
                userMedia.Review.Score = userMedia.Rating;
            }

            repo.SaveChanges();
            return returnObj;
        }

        //Get all reviews for an entry:
        public ReviewVm GetReviews(ReviewVm vm)
        {
            ReviewVm returnObj = new ReviewVm();
            returnObj.Reviews = new List<Review>();
            Media media = repo.Query<Media>().Where(m => m.Id == vm.MediaId).Include(m => m.UserMedias).FirstOrDefault();

            foreach (UserMedia um in media.UserMedias)
            {
                returnObj.Reviews.Add(um.Review);
            }

            return returnObj;
        }

        //Delete a review:
        public StatusVm DeleteReview(ReviewVm vm)
        {
            StatusVm returnObj = new StatusVm();

            Media media = repo.Query<Media>().Where(m => m.Id == vm.MediaId).Include(m => m.UserMedias).Include(m => m.Reviews).FirstOrDefault();
            UserMedia userMedia = media.UserMedias.Where(u => u.OwnerId == vm.UserId).FirstOrDefault();
            Review review = media.Reviews.Where(r => r.OwnerId == vm.UserId).FirstOrDefault();

            media.Reviews.Remove(review);
            userMedia.Review = null;
            repo.Delete<Review>(review.Id);

            repo.SaveChanges();
            return returnObj;
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
            IQueryable<Contributor> cResults = Enumerable.Empty<Contributor>().AsQueryable();
            IQueryable<ApplicationUser> uResults = Enumerable.Empty<ApplicationUser>().AsQueryable();

            //Convert to singular and lowercase:
            if (query.SearchFor == "Movies")
            {
                query.SearchFor = "movie";
            }
            else if (query.SearchFor == "Games")
            {
                query.SearchFor = "game";
            }
            else if (query.SearchFor == "Books")
            {
                query.SearchFor = "book";
            }
            else
            {
                query.SearchFor = query.SearchFor.ToLower();
            }

            query.Query = query.Query.ToLower();

            //IF PERSON:
            if (query.SearchFor == "people")
            {
                if (query.OnlyDeleted)
                {
                    cResults = (from c in db.Contributors
                                where !c.IsActive && (c.Surname.ToLower().Contains(query.Query)
                                || c.GivenName.ToLower().Contains(query.Query))
                                select c).Include(c => c.Contributions);
                }
                else if (query.IncludeDeleted)
                {
                    cResults = (from c in db.Contributors
                                where c.Surname.ToLower().Contains(query.Query)
                                || c.GivenName.ToLower().Contains(query.Query)
                                select c).Include(c => c.Contributions);
                }
                else
                {
                    cResults = (from c in db.Contributors
                                where c.IsActive && (c.Surname.ToLower().Contains(query.Query)
                                || c.GivenName.ToLower().Contains(query.Query))
                                select c).Include(c => c.Contributions);
                }
                
                returnObj.CResults = cResults.ToList();
            }
            //IF USER:
            else if (query.SearchFor == "users")
            {
                uResults = (from u in db.Users
                            where u.UserName.ToLower().Contains(query.Query)
                            select u);

                returnObj.UResults = uResults.ToList();
            }
            //IF ALL & ANY:
            else if (query.SearchFor == "all")
            {
                //Find direct matches:
                if (query.SearchBy == "Any")
                {
                    if (query.OnlyDeleted)
                    {
                        results = (from w in db.Media.Include(m => m.Contributors)
                                   where !w.IsActive && (w.Title.ToLower().Contains(query.Query)
                                   || w.Genre.ToLower().Contains(query.Query))
                                   select w);
                    }
                    else if (query.IncludeDeleted)
                    {
                        results = (from w in db.Media.Include(m => m.Contributors)
                                   where w.Title.ToLower().Contains(query.Query)
                                   || w.Genre.ToLower().Contains(query.Query)
                                   select w);
                    }
                    else
                    {
                        results = (from w in db.Media.Include(m => m.Contributors)
                                   where w.IsActive && (w.Title.ToLower().Contains(query.Query)
                                   || w.Genre.ToLower().Contains(query.Query))
                                   select w);
                    }
                    
                    var matches = results.ToList();

                    //Find matches by contributor:
                    foreach (Media media in db.Media.Include(m => m.Contributors)) //TODO: use if statements on this outer loop instead of on inner loop for better efficiency
                    {
                        bool quit = false;
                        int i = 0;

                        if (!matches.Contains(media))
                        {
                            if (query.OnlyDeleted)
                            {
                                while (!quit && i < media.Contributors.Count())
                                {
                                    if (!media.IsActive && !media.Contributors[i].IsActive && (media.Contributors[i].Surname.ToLower().Contains(query.Query) || media.Contributors[i].GivenName.ToLower().Contains(query.Query)))
                                    {
                                        matches.Add(media);
                                        quit = true;
                                    }
                                    i++;
                                }
                            }
                            else if (query.IncludeDeleted)
                            {
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
                            else
                            {
                                while (!quit && i < media.Contributors.Count())
                                {
                                    if (media.IsActive && media.Contributors[i].IsActive && (media.Contributors[i].Surname.ToLower().Contains(query.Query) || media.Contributors[i].GivenName.ToLower().Contains(query.Query)))
                                    {
                                        matches.Add(media);
                                        quit = true;
                                    }
                                    i++;
                                }
                            }
                        }
                    }

                    returnObj.Results = matches;
                }
                //IF ALL BY TITLE:
                else if (query.SearchBy == "Title")
                {
                    if (query.OnlyDeleted)
                    {
                        results = (from w in db.Media.Include(m => m.Contributors)
                                   where !w.IsActive && (w.Title.ToLower().Contains(query.Query))
                                   select w);
                    }
                    else if (query.IncludeDeleted)
                    {
                        results = (from w in db.Media.Include(m => m.Contributors)
                                   where w.Title.ToLower().Contains(query.Query)
                                   select w);
                    }
                    else
                    {
                        results = (from w in db.Media.Include(m => m.Contributors)
                                   where w.IsActive && (w.Title.ToLower().Contains(query.Query))
                                   select w);
                    }
                    
                    returnObj.Results = results.ToList();
                }
                //IF ALL BY PERSON:
                else if (query.SearchBy == "Person")
                {
                    var matches = results.ToList();

                    foreach (Media media in db.Media.Include(m => m.Contributors))
                    {
                        bool quit = false;
                        int i = 0;

                        if (query.OnlyDeleted)
                        {
                            while (!quit && i < media.Contributors.Count())
                            {
                                if (!media.Contributors[i].IsActive && (media.Contributors[i].Surname.ToLower().Contains(query.Query) || media.Contributors[i].GivenName.ToLower().Contains(query.Query)))
                                {
                                    matches.Add(media);
                                    quit = true;
                                }
                                i++;
                            }
                        }
                        else if (query.IncludeDeleted)
                        {
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
                        else
                        {
                            while (!quit && i < media.Contributors.Count())
                            {
                                if (media.Contributors[i].IsActive && (media.Contributors[i].Surname.ToLower().Contains(query.Query) || media.Contributors[i].GivenName.ToLower().Contains(query.Query)))
                                {
                                    matches.Add(media);
                                    quit = true;
                                }
                                i++;
                            }
                        }
                    }

                    returnObj.Results = matches;
                }
                //IF ALL BY GENRE:
                else if (query.SearchBy == "Genre")
                {
                    if (query.OnlyDeleted)
                    {
                        results = (from w in db.Media.Include(m => m.Contributors)
                                   where !w.IsActive && w.Genre.ToLower().Contains(query.Query)
                                   select w);
                    }
                    else if (query.IncludeDeleted)
                    {
                        results = (from w in db.Media.Include(m => m.Contributors)
                                   where w.Genre.ToLower().Contains(query.Query)
                                   select w);
                    }
                    else
                    {
                        results = (from w in db.Media.Include(m => m.Contributors)
                                   where w.IsActive && w.Genre.ToLower().Contains(query.Query)
                                   select w);
                    }
                    
                    returnObj.Results = results.ToList();
                }
            }
            //IF NOT ALL BUT ANY:
            else if (query.SearchBy == "Any")
            {
                if (query.OnlyDeleted)
                {
                    results = (from w in db.Media.Include(m => m.Contributors)
                               where !w.IsActive && (w.Type == query.SearchFor
                               && w.Title.ToLower().Contains(query.Query)
                               || w.Genre.ToLower().Contains(query.Query))
                               select w);
                }
                else if (query.IncludeDeleted)
                {
                    results = (from w in db.Media.Include(m => m.Contributors)
                               where w.Type == query.SearchFor
                               && w.Title.ToLower().Contains(query.Query)
                               || w.Genre.ToLower().Contains(query.Query)
                               select w);
                }
                else
                {
                    results = (from w in db.Media.Include(m => m.Contributors)
                               where w.IsActive && (w.Type == query.SearchFor
                               && w.Title.ToLower().Contains(query.Query)
                               || w.Genre.ToLower().Contains(query.Query))
                               select w);
                }
                
                var matches = results.ToList();
                
                foreach (Media media in db.Media.Include(m => m.Contributors))
                {
                    bool quit = false;
                    int i = 0;

                    if (!matches.Contains(media))
                    {
                        if (query.OnlyDeleted)
                        {
                            while (!quit && i < media.Contributors.Count())
                            {
                                if (!media.Contributors[i].IsActive && (media.Contributors[i].Surname.ToLower().Contains(query.Query) || media.Contributors[i].GivenName.ToLower().Contains(query.Query)))
                                {
                                    matches.Add(media);
                                    quit = true;
                                }
                                i++;
                            }
                        }
                        else if (query.IncludeDeleted)
                        {
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
                        else
                        {
                            while (!quit && i < media.Contributors.Count())
                            {
                                if (media.Contributors[i].IsActive && (media.Contributors[i].Surname.ToLower().Contains(query.Query) || media.Contributors[i].GivenName.ToLower().Contains(query.Query)))
                                {
                                    matches.Add(media);
                                    quit = true;
                                }
                                i++;
                            }
                        }
                    }
                }

                returnObj.Results = matches;
            }
            //IF NOT ALL & NOT ANY:
            else if (query.SearchBy == "Title")
            {
                if (query.OnlyDeleted)
                {
                    results = (from w in db.Media.Include(m => m.Contributors)
                               where !w.IsActive && (w.Type == query.SearchFor
                               && w.Title.ToLower().Contains(query.Query))
                               select w);
                }
                else if (query.IncludeDeleted)
                {
                    results = (from w in db.Media.Include(m => m.Contributors)
                               where w.Type == query.SearchFor
                               && w.Title.ToLower().Contains(query.Query)
                               select w);
                }
                else
                {
                    results = (from w in db.Media.Include(m => m.Contributors)
                               where w.IsActive && (w.Type == query.SearchFor
                               && w.Title.ToLower().Contains(query.Query))
                               select w);
                }
                
                returnObj.Results = results.ToList();
            }
            else if (query.SearchBy == "Person")
            {
                var typeFilter = (from w in db.Media.Include(m => m.Contributors)
                                  where w.Type == query.SearchFor
                                  select w);

                var matches = results.ToList();

                foreach (Media media in typeFilter)
                {
                    int i = 0;
                    bool quit = false;
                    if (query.OnlyDeleted)
                    {
                        while (!quit && i < media.Contributors.Count())
                        {
                            if (!media.Contributors[i].IsActive && (media.Contributors[i].Surname.ToLower().Contains(query.Query) || media.Contributors[i].GivenName.ToLower().Contains(query.Query)))
                            {
                                matches.Add(media);
                                quit = true;
                            }
                            i++;
                        }
                    }
                    else if (query.IncludeDeleted)
                    {
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
                    else
                    {
                        while (!quit && i < media.Contributors.Count())
                        {
                            if (media.Contributors[i].IsActive && (media.Contributors[i].Surname.ToLower().Contains(query.Query) || media.Contributors[i].GivenName.ToLower().Contains(query.Query)))
                            {
                                matches.Add(media);
                                quit = true;
                            }
                            i++;
                        }
                    }
                }

                returnObj.Results = matches;
            }
            else if (query.SearchBy == "Genre")
            {
                if (query.OnlyDeleted)
                {
                    results = (from w in db.Media.Include(m => m.Contributors)
                               where !w.IsActive && (w.Type == query.SearchFor
                               && w.Genre.ToLower().Contains(query.Query))
                               select w);
                }
                else if (query.IncludeDeleted)
                {
                    results = (from w in db.Media.Include(m => m.Contributors)
                               where w.Type == query.SearchFor
                               && w.Genre.ToLower().Contains(query.Query)
                               select w);
                }
                else
                {
                    results = (from w in db.Media.Include(m => m.Contributors)
                               where w.IsActive && (w.Type == query.SearchFor
                               && w.Genre.ToLower().Contains(query.Query))
                               select w);
                }
                
                returnObj.Results = results.ToList();
            }

            return returnObj;
        }

        //Add a media entry to the database:
        public Media AddMedia(MediaVm mediaVm)
        {
            if (mediaVm.Type == "movie")
            {
                //check if the user is attempting to add a duplicate entry?

                //If new movie:
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
                        Contributors = new List<Contributor>(),
                    };

                    //Add contributors and contributions while avoiding duplicates:
                    if (mediaVm.Contributors != null) //this is inefficient and needs to be reworked.
                    {
                        foreach (Contributor contributor in mediaVm.Contributors)
                        {
                            if (contributor.Contributions != null)
                            {
                                //Find contributions and add their IDs to a list:
                                var idList = new List<int>();
                                foreach (Media contribution in contributor.Contributions)
                                {
                                    idList.Add(contribution.Id);
                                }

                                //Clear view model list to prevent the entries from being re-added to the database:
                                contributor.Contributions.Clear();

                                //If new contributor:
                                if (repo.Find<Contributor>(contributor.Id) == null)
                                {
                                    //Re-add contributions by reference to prevent duplicates:
                                    foreach (int id in idList)
                                    {
                                        contributor.Contributions.Add(repo.Find<Media>(id));
                                    }

                                    movie.Contributors.Add(contributor);
                                }
                                //Otherwise, find the existing contributor and add any new contributions:
                                else
                                {
                                    Contributor original = repo.Query<Contributor>().Where(c => c.Id == contributor.Id).Include(c => c.Contributions).FirstOrDefault();

                                    //Add contributions by reference:
                                    foreach (int id in idList)
                                    {
                                        original.Contributions.Add(repo.Find<Media>(id));
                                    }

                                    movie.Contributors.Add(original);
                                }
                            }
                        }
                    }

                    repo.Add<Movie>(movie);
                    repo.SaveChanges();

                    return movie;
                }
                //If updating:
                else
                {
                    if (!mediaVm.DeleteRestore)
                    {
                        var original = repo.Query<Movie>().Where(m => m.Id == mediaVm.Id).Include(m => m.Contributors).FirstOrDefault();
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
                        original.Contributors = new List<Contributor>();

                        //Add contributors and contributions while avoiding duplicates:
                        if (mediaVm.Contributors != null)
                        {
                            foreach (Contributor contributor in mediaVm.Contributors)
                            {
                                if (contributor.Contributions != null)
                                {
                                    //Find contributions and add their IDs to a list:
                                    var idList = new List<int>();
                                    foreach (Media contribution in contributor.Contributions)
                                    {
                                        idList.Add(contribution.Id);
                                    }

                                    //Clear view model list to prevent the entries from being re-added to the database:
                                    contributor.Contributions.Clear();

                                    //If new contributor:
                                    if (repo.Find<Contributor>(contributor.Id) == null)
                                    {
                                        //Re-add contributions by reference to prevent duplicates:
                                        foreach (int id in idList)
                                        {
                                            contributor.Contributions.Add(repo.Find<Media>(id));
                                        }

                                        original.Contributors.Add(contributor);
                                    }
                                    //Otherwise, find the existing contributor and add any new contributions:
                                    else
                                    {
                                        Contributor originalContributor = repo.Query<Contributor>().Where(c => c.Id == contributor.Id).Include(c => c.Contributions).FirstOrDefault();

                                        //Add contributions by reference:
                                        foreach (int id in idList)
                                        {
                                            originalContributor.Contributions.Add(repo.Find<Media>(id));
                                        }

                                        original.Contributors.Add(originalContributor);
                                    }
                                }
                            }
                        }

                        repo.SaveChanges();
                        return original;
                    }
                    //If deleting or restoring:
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
                return null; //other media types not implemented
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

        ////////////// -- UTILITY METHODS -- //////////////

        //Update the average rating for a media:
        private void UpdateRating(Media media, UserMedia original, UserMedia _new)
        {
            if (_new.Rating != original.Rating)
            {
                //If new rating:
                if (original.Rating == 0)
                {
                    media.AverageRating = ((media.AverageRating * media.RatingCount) + _new.Rating) / (media.RatingCount + 1);
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
                    newAverage = ((newAverage * divisor) + _new.Rating) / (divisor + 1);
                    //Apply to media:
                    media.AverageRating = newAverage;
                }

                //If a review exists, update its rating:
                if (original.Review != null)
                {
                    original.Review.Score = _new.Rating;
                    media.Reviews.Where(r => r.Id == original.Review.Id).FirstOrDefault().Score = _new.Rating;
                }
            }
        }

        //Seed contributors:
        public void DebugSeed()
        {
            Movie movie = repo.Query<Movie>().Where(m => m.Id == 1).Include(m => m.Contributors).FirstOrDefault();
            Movie sharks = repo.Query<Movie>().Where(m => m.Title == "Swimming with Sharks").Include(m => m.Contributors).FirstOrDefault();
            Movie suspects = repo.Query<Movie>().Where(m => m.Title == "The Usual Suspects").Include(m => m.Contributors).FirstOrDefault();
            List<Media> contributions = new List<Media>
                    {
                        suspects,
                    };

            List<Contributor> toSeed = new List<Contributor>
            {
                new Contributor
                {
                    Id = 1,
                    Roles = "Actor",
                    Surname = "Baldwin",
                    GivenName = "Stephen",
                    DoB = new DateTime(1966, 5, 12),
                    Nationality = "USA",
                    ThumbnailUrl = "http://gonetworth.net/wp-content/uploads/2015/07/stephen-baldwin-net-worth1.jpg",
                    Contributions = contributions,
                    Description = "Stephen Baldwin was born on May 12, 1966 in Massapequa, Long Island, New York, USA as Stephen Andrew Baldwin. He is an actor and producer, known for The Usual Suspects (1995), The Young Riders (1989) and Born on the Fourth of July (1989). He has been married to Kennya Baldwin since June 10, 1990. They have two children.",
                    IsActive = true,
                },
                new Contributor
                {
                    Id = 2,
                    Roles = "Actor",
                    Surname = "Byrne",
                    GivenName = "Gabriel",
                    DoB = new DateTime(1950, 5, 12),
                    Nationality = "Ireland",
                    ThumbnailUrl = "http://www.gloriesworld.net/wp-content/uploads/2015/06/gabriel-byrne-3.jpg",
                    Contributions = contributions,
                    Description = "Byrne was the first of six children, born in Dublin, Ireland. His father was a cooper and his mother a hospital worker. He was raised Catholic and educated by the Irish Christian Brothers. He spent five years of his childhood in a seminary training to be a Catholic priest. He later said, \"I spent five years in the seminary and I suppose it was ...",
                    IsActive = true,
                },
                new Contributor
                {
                    Id = 3,
                    Roles = "Director",
                    Surname = "Singer",
                    GivenName = "Bryan",
                    DoB = new DateTime(1965, 9, 17),
                    Nationality = "USA",
                    ThumbnailUrl = "http://cdn5.thr.com/sites/default/files/2014/04/bryan_singer_1_p.jpg",
                    Contributions = contributions,
                    Description = "Bryan Singer was born on September 17, 1965 in New York City, New York, USA as Bryan Jay Singer. He is a producer and director, known for House M.D. (2004), The Usual Suspects (1995) and X-Men 2 (2003).",
                    IsActive = true,
                },
                new Contributor
                {
                    Id = 4,
                    Roles = "Writer",
                    Surname = "McQuarrie",
                    GivenName = "Christopher",
                    DoB = new DateTime(1968, 1, 1),
                    Nationality = "USA",
                    ThumbnailUrl = "http://cdn2.thr.com/sites/default/files/2013/08/christopher_mcquarrie_a_p.jpg",
                    Contributions = contributions,
                    Description = "Christopher McQuarrie was born in 1968 in Princeton, New Jersey, USA. He is a writer and producer, known for Mission: Impossible - Rogue Nation (2015), The Usual Suspects (1995) and Edge of Tomorrow (2014). He is married to Heather McQuarrie.",
                    IsActive = true,
                },
                new Contributor
                {
                    Id = 5,
                    Roles = "Actor",
                    Surname = "Spacey",
                    GivenName = "Kevin",
                    DoB = new DateTime(1959, 7, 26),
                    Nationality = "USA",
                    ThumbnailUrl = "https://media3.popsugar-assets.com/files/2014/03/25/923/n/1922283/e16b56538b725b87_thumb_temp_image344409741395781652.jpg.preview.jpg",
                    Contributions = contributions,
                    Description = "As enigmatic as he is talented, Kevin Spacey has always kept the details of his private life closely guarded. As he explained in a 1998 interview with the London Evening Standard, \"the less you know about me, the easier it is to convince you that I am that character on screen.",
                    IsActive = true,
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