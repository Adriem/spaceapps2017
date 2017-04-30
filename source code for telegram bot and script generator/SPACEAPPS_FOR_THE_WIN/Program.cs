using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Telegram.Bot;

namespace SPACEAPPS_FOR_THE_WIN
{
    public class Program
    {
        private static readonly TelegramBotClient Bot = new TelegramBotClient("353924190:AAFFWL_bibeRCUT2zYKlMmoEWF2aK_JxD1I");

        public static void Main(string[] args)
        {
            //InsertWithSave();

            //InsertAcronymous();

            //InsertDefinitions();

            testApiAsync();
        }

        #region Generate Scripts Functions
        public static void InsertWithSave()
        {
            string query = String.Empty;
            string lastName = String.Empty;

            using (StreamReader sr = new StreamReader(@"C:\Users\Dani\Desktop\data.txt"))
            {
                while (!sr.EndOfStream)
                {
                    string[] separators = { "," };
                    string[] line = sr.ReadLine().Split(separators, StringSplitOptions.RemoveEmptyEntries);

                    if (!lastName.Equals(line[0]))
                    {
                        if (!String.IsNullOrEmpty(query))
                            query += "]});\r\n";

                        query += "db.acronyms.save({name: '" + line[0].Trim() + "', words: ['" + line[1].Trim() + "'";
                    }
                    else
                    {
                        query += String.Format(",'{0}'", line[1]);
                    }

                    lastName = line[0];
                }
            }

            using (StreamWriter sw = new StreamWriter(@"C:\Users\Dani\Desktop\script1.txt", false))
            {
                sw.Write(query);
            }
        }

        public static void InsertAcronymous()
        {
            string query = "[";
            string lastName = String.Empty;
            int firstLine = 0;

            using (StreamReader sr = new StreamReader(@"C:\Users\Dani\Desktop\data.txt"))
            {
                while (!sr.EndOfStream)
                {
                    string[] separators = { "," };
                    string[] line = sr.ReadLine().Split(separators, StringSplitOptions.RemoveEmptyEntries);

                    if (!lastName.Equals(line[0]))
                    {
                        if (firstLine == 1)
                            query += "]},\r\n";

                        query += "{\"name\": \"" + line[0].Trim() + "\", \"words\": [\"" + line[1].Trim() + "\"";
                    }
                    else
                    {
                        query += String.Format(",\"{0}\"", line[1]);
                    }

                    lastName = line[0];

                    if (firstLine == 0)
                        firstLine = 1;
                }
            }

            query += "];";

            using (StreamWriter sw = new StreamWriter(@"C:\Users\Dani\Desktop\script1.json", false))
            {
                sw.Write(query);
            }
        }

        public static void InsertDefinitions()
        {
            string query = String.Empty;

            using (StreamReader sr = new StreamReader(@"C:\Users\Dani\Desktop\fullDefinitionScript.txt"))
            {
                string[] separators = { "\r\n" };
                string[] content = sr.ReadToEnd().Split(separators, StringSplitOptions.RemoveEmptyEntries);

                List<string> fullContent = new List<string>();

                string name = String.Empty;
                string definition = String.Empty;
                content.ToList().ForEach(x =>
                {
                    if (!x.StartsWith("    "))
                    {
                        if(!String.IsNullOrEmpty(definition))
                        {
                            fullContent.Add(definition.Replace("    ", ""));
                            definition = String.Empty;
                        }
                        fullContent.Add(x);
                    }
                    else
                    {
                        definition += x;
                    }
                });

                query = "[";

                int i = 0;
                fullContent.ForEach(x => 
                {
                    if(i%2 != 0)
                    {
                        List<string> findNames = fullContent.FindAll(s => s.Equals(x));

                        query += "{\"text\": \"" + x + "\", \"words\": [";

                        int h = 0;
                        findNames.ForEach(word =>
                        {
                            if(h == 0)
                                query += "\"" + word + "\"";
                            else
                                query += ",\"" + word + "\"";
                            h++;
                        });

                        if (i < fullContent.Count-1)
                            query += "]},\r\n";
                        else
                            query += "]}\r\n";
                    }

                    i++;
                });

                query += "]";

                using (StreamWriter sw = new StreamWriter(@"C:\Users\Dani\Desktop\scriptDefinitions.json", false))
                {
                    sw.Write(query);
                }
            }
        }

        #endregion

        #region Telegram Bot

        public static async void testApiAsync()
        {
            var me = Bot.GetMeAsync().Result;

            Console.WriteLine("Hello my name is " + me.FirstName);

            /*
            Console.Title = me.Username;

            Bot.StartReceiving();
            Console.ReadLine();
            Bot.StopReceiving();
            */
            Console.ReadLine();            
        }

        #endregion
    }
}
