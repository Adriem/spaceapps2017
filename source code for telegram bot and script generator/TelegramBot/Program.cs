using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Telegram.Bot;
using Telegram.Bot.Args;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
using Telegram.Bot.Types.InlineQueryResults;
using Telegram.Bot.Types.InputMessageContents;
using Telegram.Bot.Types.ReplyMarkups;

namespace TelegramBot
{
    class Program
    {
        private static readonly TelegramBotClient Bot = new TelegramBotClient("353924190:AAFFWL_bibeRCUT2zYKlMmoEWF2aK_JxD1I");

        private static readonly HttpClient client = new HttpClient();

        static void Main(string[] args)
        {
            Bot.OnCallbackQuery += BotOnCallbackQueryReceived;
            Bot.OnMessage += BotOnMessageReceived;
            Bot.OnMessageEdited += BotOnMessageReceived;
            Bot.OnInlineQuery += BotOnInlineQueryReceived;
            Bot.OnInlineResultChosen += BotOnChosenInlineResultReceived;
            Bot.OnReceiveError += BotOnReceiveError;

            var me = Bot.GetMeAsync().Result;

            Console.Title = me.Username;

            Bot.StartReceiving();
            Console.ReadLine();
            Bot.StopReceiving();
        }

        private static void BotOnReceiveError(object sender, ReceiveErrorEventArgs receiveErrorEventArgs)
        {
            Debugger.Break();
        }

        private static void BotOnChosenInlineResultReceived(object sender, ChosenInlineResultEventArgs chosenInlineResultEventArgs)
        {
            Console.WriteLine("Received choosen inline result: {chosenInlineResultEventArgs.ChosenInlineResult.ResultId}");
        }

        private static async void BotOnInlineQueryReceived(object sender, InlineQueryEventArgs inlineQueryEventArgs)
        {
            InlineQueryResult[] results = {
                new InlineQueryResultLocation
                {
                    Id = "1",
                    Latitude = 40.7058316f, // displayed result
                    Longitude = -74.2581888f,
                    Title = "New York",
                    InputMessageContent = new InputLocationMessageContent // message if result is selected
                    {
                        Latitude = 40.7058316f,
                        Longitude = -74.2581888f,
                    }
                },

                new InlineQueryResultLocation
                {
                    Id = "2",
                    Longitude = 52.507629f, // displayed result
                    Latitude = 13.1449577f,
                    Title = "Berlin",
                    InputMessageContent = new InputLocationMessageContent // message if result is selected
                    {
                        Longitude = 52.507629f,
                        Latitude = 13.1449577f
                    }
                }
            };

            await Bot.AnswerInlineQueryAsync(inlineQueryEventArgs.InlineQuery.Id, results, isPersonal: true, cacheTime: 0);
        }

        private static async void BotOnMessageReceived(object sender, MessageEventArgs messageEventArgs)
        {
            var message = messageEventArgs.Message;

            if (message == null || message.Type != MessageType.TextMessage)
            {
                mainInfo(message.Chat.Id);
            }
            else if(message.Text.StartsWith("/getacronym"))
            {
                await Bot.SendChatActionAsync(message.Chat.Id, ChatAction.Typing);

                string acronym = String.Empty;

                string[] delimiter = { " " };
                if (message.Text.Contains(delimiter[0]))
                {
                    acronym = message.Text.Split(delimiter, StringSplitOptions.RemoveEmptyEntries)[1].Trim();

                    var url = "http://10.10.11.35:3000/earthtionary/acronym/" + acronym;

                    var json = new WebClient().DownloadString(url);

                    List<Acronym> deserializedProduct = JsonConvert.DeserializeObject<List<Acronym>>(json);

                    List<string> allWords = new List<string>();
                    deserializedProduct.ForEach(x =>
                    {
                        x.word.ToList().ForEach(y =>
                        {
                            allWords.Add(y);
                        });
                    });

                    string[] words = allWords.ToArray();

                    InlineKeyboardButton[] buttons = new InlineKeyboardButton[words.Length];

                    if(words.Length > 0)
                    {
                        int i = 0;
                        words.ToList().ForEach(x =>
                        {
                            buttons[i] = new InlineKeyboardButton(x);
                            i++;
                        });

                        var keyboard = new InlineKeyboardMarkup(buttons);

                        await Task.Delay(500);

                        await Bot.SendTextMessageAsync(message.Chat.Id, "Choose",
                            replyMarkup: keyboard);
                    }
                    else
                    {
                        await Bot.SendTextMessageAsync(message.Chat.Id, "No result was founded");
                    }
                }
                else
                {
                    await Bot.SendTextMessageAsync(message.Chat.Id, "You have to send an acronym, if you want to find a definition");
                }
            }
            else if (message.Text.StartsWith("/getdefinition"))
            {
                await Bot.SendChatActionAsync(message.Chat.Id, ChatAction.Typing);

                string acronym = String.Empty;

                string[] delimiter = { " " };
                if (message.Text.Contains(delimiter[0]))
                {
                    string[] def = message.Text.Split(delimiter, StringSplitOptions.RemoveEmptyEntries);

                    if (def.Length > 1)
                    {
                        string word = String.Empty;

                        int i = 0;
                        def.ToList().ForEach(x =>
                        {
                            if(i!=0)
                            {
                                if (String.IsNullOrEmpty(word))
                                    word += x;
                                else
                                    word += " " + x;
                            }

                            i++;
                        });

                        var url = "http://10.10.11.35:3000/earthtionary/word/" + word.Replace(" ", "%20");

                        var json = new WebClient().DownloadString(url);

                        List<Acronym> deserializedProduct = JsonConvert.DeserializeObject<List<Acronym>>(json);

                        int j = 1;
                        string definition = "Definition of " + word + ":\r\n\r\n";
                        deserializedProduct.ForEach(x =>
                        {
                            if (!String.IsNullOrEmpty(x.text))
                            {
                                definition += "Definition " + j + ": " + x.text + "\r\n";
                                j++;
                            }
                        });

                        if(j > 1)
                            await Bot.SendTextMessageAsync(message.Chat.Id, definition);
                        else
                            await Bot.SendTextMessageAsync(message.Chat.Id, "No result was founded");
                    }
                }
                else
                {
                    await Bot.SendTextMessageAsync(message.Chat.Id, "You have to send a word, if you want to find a definition");
                }
            }
            else if(message.Text.StartsWith("/"))
            {
                return;
            }
            else
            {
                mainInfo(message.Chat.Id);
            }
        }

        public static async void mainInfo(long id)
        {
            await Bot.SendChatActionAsync(id, ChatAction.Typing);

            string mainInfo = "Welcome to the Earthtionary Bot\r\n" +
                              "Here you will find a lot of definitions that are related with the earth.\r\n\r\n" +
                              "First of all, you could just start by trying to send the following commands:\r\n"+
                              "\\getacronym\r\n" +
                              "\\getdefinition\r\n\r\n" +
                              "Good luck!";

            await Task.Delay(500);

            await Bot.SendTextMessageAsync(id, mainInfo);
        }

        private static async void BotOnCallbackQueryReceived(object sender, CallbackQueryEventArgs callbackQueryEventArgs)
        {
            string word = callbackQueryEventArgs.CallbackQuery.Data;

            var url = "http://10.10.11.35:3000/earthtionary/word/" + word.Replace(" ", "%20");

            var json = new WebClient().DownloadString(url);

            List<Acronym> deserializedProduct = JsonConvert.DeserializeObject<List<Acronym>>(json);

            int i = 1;
            string definition = "Definition of " + word + ":\r\n\r\n";
            deserializedProduct.ForEach(x =>
            {
                if(!String.IsNullOrEmpty(x.text))
                {
                    definition += "Definition " + i + ": " + x.text + "\r\n";
                    i++;
                }
            });

            await Bot.SendTextMessageAsync(callbackQueryEventArgs.CallbackQuery.Message.Chat.Id, definition);
        }
    }
}
