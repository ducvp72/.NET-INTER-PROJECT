using System;
using System.Net.Mail;
using System.Threading.Tasks;
using LmsBackEnd.Options;
using Microsoft.Extensions.Options;

namespace LmsBackEnd
{
    public class MailService : IMailService
    {
        private readonly string Gmail;
        private readonly string Password;
        public MailService(IOptions<GmailOption> opt)
        {
            var value = opt.Value;
            Gmail = value.Gmail;
            Password = value.Password;
        }
        public string GetMailBody(ACCOUNT oRegisterModel)
        {
//Đường dẫn
            string url = "http://group04lms.japaneast.azurecontainer.io/api/confirmmail?username=" + oRegisterModel.UserName;

            return string.Format(@"<div style='text-align:center;'>
                                    <h1>Welcom to LMS_GROUP04</h1>
                                    <h3>Click below button for verify your Email Id</h3>
                                    <form method='post' action='{0}' style='display: inline;'>
                                      <button type = 'submit' style=' display: block;
                                                                    text-align: center;
                                                                    font-weight: bold;
                                                                    background-color: #ff0000;
                                                                    font-size: 16px;
                                                                    border-radius: 10px;
                                                                    color:#ffffff;
                                                                    cursor:pointer;
                                                                    width:100%;
                                                                    padding:10px;'>
                                        Confirm Mail
                                      </button>
                                    </form>
                                </div>", url, oRegisterModel.UserName);
        }

         public string GetMailBodyChangeEmail(string userid, string email)
        {
            //Đường dẫn
            string url = "http://group04lms.japaneast.azurecontainer.io/api/User/Confirmmail/" + userid + "?email=" + email;

            return string.Format(@"<div style='text-align:center;'>
                                    <h1>Welcom to LMS_GROUP04</h1>
                                    <h3>Click below button for verify your new Email</h3>
                                    <form method='post' action='{0}' style='display: inline;'>
                                      <button type = 'submit' style=' display: block;
                                                                    text-align: center;
                                                                    font-weight: bold;
                                                                    background-color: #00BFFF;
                                                                    font-size: 16px;
                                                                    border-radius: 10px;
                                                                    color:#ffffff;
                                                                    cursor:pointer;
                                                                    width:100%;
                                                                    padding:10px;'>
                                        Confirm Mail
                                      </button>
                                    </form>
                                </div>", url);
        }

         public string GetMailBodyChangePassword(string id)
        {
            //Đổi đường link mới để vô giao diện đổi password
            //Chinh o day nha Tin
            string url = "http://lmsfpt-group4.surge.sh/get-new-password";

#region Giao diện test
            // return string.Format(@"<div style='text-align:center;'>
            //                         <h1>Welcom to LMS_GROUP04</h1>
            //                         <h3>Click below button for verify your Email Id</h3>
            //                         <form method='post' action='{0}' style='display: inline;'>
            //                             <input type='password' name='userPassword' id='userPassword'>
            //                             <input type='password' name='confirmPassword' id='confirmPassword'>
            //                             <br>
            //                           <button type = 'submit' style=' display: block;
            //                                                         text-align: center;
            //                                                         font-weight: bold;
            //                                                         background-color: #ff0000;
            //                                                         font-size: 16px;
            //                                                         border-radius: 10px;
            //                                                         color:#ffffff;
            //                                                         cursor:pointer;
            //                                                         width:100%;
            //                                                         padding:10px;'>
            //                             Confirm Mail
            //                           </button>
            //                         </form>
            //                     </div>", url);
#endregion
                         
                         return string.Format(@"<div style='text-align:center;'>
                                    <h1>Welcom to LMS_GROUP04</h1>
                                    <h3>Click below button to Recovered your Account</h3>
                                    <a href='{0}' style= 'color:#f02849; font-size: 20px;'>Click here !</a>
                                </div>", url);
        }

        public async Task<string> SendMail(MailModel oMailModel)
        {
            try
            {
                using (MailMessage mail = new MailMessage())
                {
                    mail.From = new MailAddress(Gmail);
                    oMailModel.ToMails.ForEach(x =>
                    {
                        mail.To.Add(x);
                    });
                    mail.Subject = oMailModel.Subject;
                    mail.Body = oMailModel.Body;
                    mail.IsBodyHtml = oMailModel.IsBodyHtml;
                    oMailModel.Attachments.ForEach(x =>
                    {
                        mail.Attachments.Add(new Attachment(x));
                    });
                    using (SmtpClient smtp = new SmtpClient("smtp.gmail.com", 587))
                    {
                        smtp.UseDefaultCredentials = false;
                        smtp.Credentials = new System.Net.NetworkCredential(Gmail, Password);
                        smtp.EnableSsl = true;
                        await smtp.SendMailAsync(mail);
                        return Message.MailSent;
                    }
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
    }
}