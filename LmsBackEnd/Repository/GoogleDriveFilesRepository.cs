using Google.Apis.Auth.OAuth2;
using Google.Apis.Drive.v3;
using Google.Apis.Services;
using Google.Apis.Util.Store;
using LmsBackEnd.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Threading;
using System.Threading.Tasks;

namespace LmsBackEnd.Repository
{
    public class GoogleDriveFilesRepository
    {
        public static string[] Scopes = { DriveService.Scope.Drive };

        public static DriveService GetService()
        {
            UserCredential credential;
            using (var stream = new FileStream(@"credentials.json", FileMode.Open, FileAccess.Read))
            {
                string FolderPath = @"";
                string FilePath = Path.Combine(FolderPath, "DriveServiceCredentials.json");

                credential = GoogleWebAuthorizationBroker.AuthorizeAsync(
                    GoogleClientSecrets.FromStream(stream).Secrets,
                    Scopes,
                    "user",
                    CancellationToken.None,
                    new FileDataStore(FilePath, true)).Result;
            }

            DriveService service = new DriveService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = "ProjectLMS"
            });

            return service;
        }

        public static List<GoogleDriveFiles> GetDriveFiles()
        {
            DriveService service = GetService();
            FilesResource.ListRequest FileListRequest = service.Files.List();

            FileListRequest.Fields = "nextPageToken, files(id, name, size, version, createdTime)";

            IList<Google.Apis.Drive.v3.Data.File> files = FileListRequest.Execute().Files;
            List<GoogleDriveFiles> FileList = new List<GoogleDriveFiles>();

            if (files != null && files.Count > 0)
            {
                foreach (var file in files)
                {
                    GoogleDriveFiles File = new GoogleDriveFiles
                    {
                        Id = file.Id,
                        Name = file.Name,
                        Size = file.Size,
                        Version = file.Version,
                        CreatedTime = file.CreatedTime
                    };
                    FileList.Add(File);
                }
            }

            return FileList;
        }

        public static string FileUpload(IFormFile file, string accountID)
        {
            if (file != null && file.Length > 0)
            {
                DriveService service = GetService();

                try
                {
                    string path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", file.FileName);

                    using (var stream = new FileStream(path, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }

                    var FileMetaData = new Google.Apis.Drive.v3.Data.File();
                    FileMetaData.Name = Path.GetFileName(file.FileName);

                    string folderID = CreateFolder(accountID);

                    FileMetaData.Parents = new List<string> { folderID };

                    FilesResource.CreateMediaUpload request;

                    using (var stream = new FileStream(path, FileMode.Open))
                    {
                        request = service.Files.Create(FileMetaData, stream, file.ContentType);
                        request.Fields = "id";
                        request.Upload();
                    }

                    File.Delete(path);

                    return "https://drive.google.com/file/d/" + request.ResponseBody.Id + "/view?usp=sharing";
                }
                catch (Exception)
                {
                    return "0";
                }
            }

            return "0";
        }

        public static void SaveStream(MemoryStream stream, string FilePath)
        {
            using (FileStream file = new FileStream(FilePath, FileMode.Create, FileAccess.ReadWrite))
            {
                stream.WriteTo(file);
            }
        }

        private static string CreateFolder(string accountID)
        {
            DriveService service = GetService();
            FilesResource.ListRequest FileListRequest = service.Files.List();

            FileListRequest.Fields = "nextPageToken, files(id, name, size, version, createdTime)";

            IList<Google.Apis.Drive.v3.Data.File> files = FileListRequest.Execute().Files;
            List<GoogleDriveFiles> FileList = new List<GoogleDriveFiles>();

            string folderID = "";
            if (files != null && files.Count > 0)
            {
                foreach (var file in files)
                {
                    if (file.Name == accountID) folderID = file.Id;
                }
            }

            if (folderID == "")
            {
                var fileMetadata = new Google.Apis.Drive.v3.Data.File
                {
                    Name = accountID,
                    MimeType = "application/vnd.google-apps.folder"
                };
                var folderRequest = service.Files.Create(fileMetadata);
                folderRequest.Fields = "id";
                Google.Apis.Drive.v3.Data.File FolderMoi = folderRequest.Execute();
                service.Files.Create(fileMetadata).Fields = "id";

                folderID = FolderMoi.Id;
            }

            return folderID;
        }

        //public static string DownloadFile(string fileID)
        //{
        //    string result = "";

        //    DriveService service = GetService();

        //    var request = service.Files.Get(fileID);

        //    var streamDownload = new MemoryStream();

        //    string path = Path.Combine("D:", "FileDownload", fileID);

        //    request.MediaDownloader.ProgressChanged += (Google.Apis.Download.IDownloadProgress progress) =>
        //    {
        //        switch (progress.Status)
        //        {
        //            case Google.Apis.Download.DownloadStatus.Downloading:
        //                {
        //                    break;
        //                }
        //            case Google.Apis.Download.DownloadStatus.Completed:
        //                {
        //                    SaveStream(streamDownload, path);
        //                    result = path;
        //                    break;
        //                }
        //            case Google.Apis.Download.DownloadStatus.Failed:
        //                {
        //                    result = "0";
        //                    break;
        //                }
        //        }
        //    };
        //    request.Download(streamDownload);

        //    return result;
        //}
    }
}
