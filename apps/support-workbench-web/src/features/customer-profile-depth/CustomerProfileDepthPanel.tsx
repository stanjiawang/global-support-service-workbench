import { useSelector } from "react-redux";
import { selectCustomerProfileDepth, selectCustomerProfileDepthSummary } from "@features/customer-profile-depth/selectors";
import { DataTable } from "@shared/ui/DataTable";
import { DetailList } from "@shared/ui/DetailList";

export function CustomerProfileDepthPanel(): JSX.Element {
  const summary = useSelector(selectCustomerProfileDepthSummary);
  const profile = useSelector(selectCustomerProfileDepth);

  return (
    <section className="feature-panel" aria-labelledby="customer-profile-depth-heading">
      <h2 id="customer-profile-depth-heading">customer-profile-depth</h2>
      <p>Expanded customer context: contacts, organization, assets/orders/subscriptions, and interaction history.</p>

      <h3>Summary</h3>
      <DetailList
        ariaLabel="Customer profile depth summary"
        items={[
          { label: "State", value: summary.status },
          { label: "Customer", value: summary.customerId },
          { label: "Tier", value: summary.tier },
          { label: "Contacts", value: String(summary.contacts) },
          { label: "Assets", value: String(summary.assets) },
          { label: "Orders", value: String(summary.orders) },
          { label: "Subscriptions", value: String(summary.subscriptions) },
          { label: "Interactions", value: String(summary.interactions) },
          { label: "Error", value: summary.error ?? "none" }
        ]}
      />

      {profile ? (
        <>
          <h3>Organization</h3>
          <DetailList
            ariaLabel="Organization details"
            items={[
              { label: "Org ID", value: profile.org.orgId },
              { label: "Org Name", value: profile.org.orgName },
              { label: "Segment", value: profile.org.segment },
              { label: "Region", value: profile.org.region },
              { label: "Account Owner", value: profile.org.accountOwner }
            ]}
          />

          <h3>Contacts</h3>
          <DataTable
            rows={profile.contacts}
            getRowKey={(row) => row.contactId}
            emptyMessage="No contacts."
            columns={[
              { key: "name", header: "Name", render: (row) => row.name },
              { key: "role", header: "Role", render: (row) => row.role },
              { key: "email", header: "Email", render: (row) => row.email },
              { key: "phone", header: "Phone", render: (row) => row.phone }
            ]}
          />

          <h3>Assets</h3>
          <DataTable
            rows={profile.assets}
            getRowKey={(row) => row.assetId}
            emptyMessage="No assets."
            columns={[
              { key: "asset", header: "Asset", render: (row) => row.name },
              { key: "type", header: "Type", render: (row) => row.type },
              { key: "status", header: "Status", render: (row) => row.status },
              { key: "renewed", header: "Renewed", render: (row) => row.renewedAt }
            ]}
          />

          <h3>Orders</h3>
          <DataTable
            rows={profile.orders}
            getRowKey={(row) => row.orderId}
            emptyMessage="No orders."
            columns={[
              { key: "order", header: "Order", render: (row) => row.orderId },
              { key: "amount", header: "Amount USD", render: (row) => `$${row.amountUsd}` },
              { key: "status", header: "Status", render: (row) => row.status },
              { key: "ordered", header: "Ordered At", render: (row) => row.orderedAt }
            ]}
          />

          <h3>Subscriptions</h3>
          <DataTable
            rows={profile.subscriptions}
            getRowKey={(row) => row.assetId}
            emptyMessage="No subscriptions."
            columns={[
              { key: "sub", header: "Subscription", render: (row) => row.name },
              { key: "status", header: "Status", render: (row) => row.status },
              { key: "renewed", header: "Renewed", render: (row) => row.renewedAt }
            ]}
          />

          <h3>Interaction History</h3>
          <DataTable
            rows={profile.interactionHistory}
            getRowKey={(row) => row.interactionId}
            emptyMessage="No interactions."
            virtualized={profile.interactionHistory.length > 12}
            containerHeightPx={320}
            rowHeightPx={40}
            columns={[
              { key: "time", header: "Occurred", render: (row) => row.occurredAt },
              { key: "channel", header: "Channel", render: (row) => row.channel },
              { key: "summary", header: "Summary", render: (row) => row.summary }
            ]}
          />
        </>
      ) : (
        <p>Loading customer profile context.</p>
      )}
    </section>
  );
}
