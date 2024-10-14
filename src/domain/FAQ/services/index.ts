import { DbFaqRepository } from "../infra/repository/faq-repository";
import { FaqService } from "./faq.service";

export const faqService = new FaqService(new DbFaqRepository())