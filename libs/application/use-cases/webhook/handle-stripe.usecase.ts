import { stripePlanDTO } from "../../../shared/types/src";
import { IOrganizationRepository } from "../../interfaces/org-repository.interface";
import { IStripeService } from "../../interfaces/stripe-service.interface";


export class HandleStripeWebhookUseCase {
  constructor(
    private stripeService: IStripeService,
    private orgRepository: IOrganizationRepository
  ) {}

    async execute(event: any) {

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
            const updateData: stripePlanDTO = await this.stripeService.parseCheckoutSession(session.id);
            const { email, ...restData } = updateData;
            if (email) {
                //todo : find better way to get orgId here. And  else case is not defined for email or org is null 
                const organization = await this.orgRepository.findByEmail(email);
                if (organization) {
                    await this.orgRepository.update(organization.id, { plan: restData.plan, subscriptionId: restData.subscriptionId });
                }
            }

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const res = await this.orgRepository.find({ subscriptionId: subscription.id }, 0, 1);
        const orgId = res.orgs[0]?.id;
        if (orgId) await this.orgRepository.update(orgId, { plan: "free" });
        break;
      }

      case 'invoice.payment_succeeded': {
        // console.log(event.data.object)
        //todo :
        // await this.stripeService.handleInvoice(event.data.object);
        break;
      }
      case 'customer.subscription.updated': {
        // console.log("updated = ",event)
        break;
        }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }
}
