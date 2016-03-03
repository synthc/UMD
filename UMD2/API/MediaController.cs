﻿using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Web.Http;
using UMD2.Models;

namespace UMD.API
{
    public class MediaController : ApiController
    {
        private IMediaRepository repo;

        public MediaController(IMediaRepository repo)
        {
            this.repo = repo;
        }

        public IHttpActionResult Get()
        {
            var user = User.Identity as ClaimsIdentity;

            if (user.HasClaim("Denied", "true"))
            {
                return Unauthorized();
            }

            var data = repo.GetMedia();
            return Ok(data);
        }

        public IHttpActionResult Get(int id)
        {
            var data = repo.GetMediaById(id);
            return Ok(data);
        }

        public IHttpActionResult Get(string userName)
        {
            string userId = null;

            if (userName == "thisUser")
            {
                userId = User.Identity.GetUserId();
            }
            else
            {
                //userId = [find Id from userName]
            }

            var data = repo.GetUserById(userId);
            return Ok(data);
        }

        [Route("api/media/getUserId")]
        public IHttpActionResult getUserId()
        {
            StatusVm returnObj = new StatusVm();
            returnObj.Message = User.Identity.GetUserId();
            return Ok(returnObj);
        }

        [Route("api/media/search")]
        public IHttpActionResult Search(QueryVm query)
        {
            return Ok(repo.Search(query));
        }

        [Authorize]
        [Route("api/media/addToDb")]
        public IHttpActionResult Post(MediaVm mediaVm)
        {
            var data = repo.AddMedia(mediaVm);
            return Ok(data);
        }

        [Authorize]
        [Route("api/media/changeList")]
        public IHttpActionResult Post(ChangeListVm vm)
        {
            vm.UserId = User.Identity.GetUserId();
            return Ok(repo.ChangeList(vm));
        }

        [Authorize]
        [Route("api/media/checkMasterlist")]
        public IHttpActionResult CheckMasterlist(ChangeListVm vm)
        {
            vm.UserId = User.Identity.GetUserId();
            return Ok(repo.CheckMasterlist(vm));
        }

        [Authorize]
        [Route("api/media/updateUserMedia")]
        public IHttpActionResult UpdateUserMedia(UserMedia userMedia)
        {
            userMedia.OwnerId = User.Identity.GetUserId();
            return Ok(repo.UpdateUserMedia(userMedia));
        }

        [Authorize]
        [Route("api/media/addContributor")]
        public IHttpActionResult AddContributor(ContributorVm vm)
        {
            repo.AddContributor(vm);
            return Ok();
        }

        [Authorize]
        [Route("api/media/removeContributor")]
        public IHttpActionResult RemoveContributor(ContributorVm vm)
        {
            repo.RemoveContributor(vm);
            return Ok();
        }

        [Authorize]
        [Route("api/media/delete")]
        public IHttpActionResult Delete(int id)
        {
            var user = User.Identity as ClaimsIdentity;
            if (!user.HasClaim("Admin", "true"))
            {
                return Unauthorized();
            }

            repo.DeleteMedia(id);
            return Ok();
        }

        [Route("api/media/debugSeed")]
        public IHttpActionResult DebugSeed()
        {
            repo.DebugSeed();
            return Ok();
        }
    }
}