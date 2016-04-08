using System.Collections.Generic;
using UMD2.Models;

namespace UMD.API
{
    public interface IMediaRepository
    {
        void AddContributor(ContributorVm vm);
        Media AddMedia(MediaVm mediaVm);
        StatusVm AddReview(Review vm);
        StatusVm ChangeList(ChangeListVm vm);
        StatusVm CheckMasterlist(ChangeListVm vm);
        void DebugSeed();
        void DeleteContributor(GenericVm vm);
        void DeleteMedia(int id);
        StatusVm DeleteReview(ReviewVm vm);
        void EditContributor(Contributor contributor);
        Contributor GetContributorById(int id);
        ICollection<Media> GetMedia();
        Media GetMediaById(int id);
        ReviewVm GetReviews(ReviewVm vm);
        ApplicationUser GetUserById(string userId);
        void RemoveContributor(ContributorVm vm);
        QueryVm Search(QueryVm query);
        StatusVm UpdateUserMedia(UserMedia userMedia);
    }
}