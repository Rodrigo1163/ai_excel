import { resolve } from "node:path";

import { PromptTemplate } from "@langchain/core/prompts";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";

import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";

import prismaClient from "../../prisma";

interface SendMessageIaExcelServicesProps {
  userId: string;
  message: string;
}

class SendMessageIaExcelServices {
  async execute({ userId, message }: SendMessageIaExcelServicesProps) {
    if (!userId) {
      throw new Error("Faça seu login");
    }
    if (!message) {
      throw new Error("Digite uma mensagem");
    }

    const file = await prismaClient.excel.findUnique({
      where: {
        userId,
      },
    });

    if (!file) {
      throw new Error("Faça o upload do arquivo excel");
    }

    const filePath = resolve(
      __dirname,
      "..",
      "..",
      "..",
      "tmp",
      "excel",
      file.path
    );

    const loader = new CSVLoader(filePath);
    const docs = await loader.load();

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const splits = await textSplitter.splitDocuments(docs);
    const vectorStore = await MemoryVectorStore.fromDocuments(
      splits,
      new OpenAIEmbeddings()
    );
    const retriever = vectorStore.asRetriever();
    const llm = new ChatOpenAI({ model: "gpt-3.5-turbo", temperature: 0 });

    const template = `
      Responda a pergunta com base nos contextos abaixo.
      Se caso texto estiver muito inconsistente, diga que o modelo não está correto e que a estrutura do excel tem a seguinte estrutura:
        A primeira coluna e linha deve conter o titulo pergunta e a segunda coluna deve conter o titulo resposta
        Invente um exemplo de pergunta e resposta
      
      {context}

      Question: {question}
    `;
    const customRagPrompt = PromptTemplate.fromTemplate(template);
    const ragChain = await createStuffDocumentsChain({
      llm,
      prompt: customRagPrompt,
      outputParser: new StringOutputParser(),
    });

    const context = await retriever.getRelevantDocuments(message);

    const response = await ragChain.invoke({
      question: message,
      context,
    });
    return response;
  }
}

export { SendMessageIaExcelServices };
