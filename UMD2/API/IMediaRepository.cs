using System.Collections.Generic;
using UMD2.Models;

namespace UMD.API
{
    public interface IMediaRepository
    {
        void AddContributor(ContributorVm vm);
        Movie AddMedia(MediaVm mediaVm);
        StatusVm ChangeList(ChangeListVm vm);
        StatusVm CheckMasterlist(ChangeListVm vm);
        void DebugSeed();
        void DeleteMedia(int id);
        ICollection<Media> GetMedia();
        Media GetMediaById(int id);
        ApplicationUser GetUserById(string userId);
        void RemoveContributor(ContributorVm vm);
        QueryVm Search(QueryVm query);
        StatusVm UpdateUserMedia(UserMedia userMedia);
    }
}