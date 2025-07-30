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
            console.log( "updated data === ",updateData)
            const { email, ...restData } = updateData;
            if (email) {
                //todo : find better way to get orgId here. And  else case is not defined for email or org is null 
                const organization = await this.orgRepository.findByEmail(email);
                console.log(organization)
                if (organization) {
                    let res = await this.orgRepository.update(organization.id, { plan: restData.plan, subscriptionId: restData.subscriptionId });
                    console.log("after update ========", res)
                }
            }

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        await this.orgRepository.update(subscription.id, {
            plan: 'free',
            //todo:
        //   startDate: null,
        //   endDate: null,
        //   period: null,
        });
        break;
      }

      case 'invoice.payment_succeeded': {
        // await this.stripeService.handleInvoice(event.data.object);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }
}
