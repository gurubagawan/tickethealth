class AddHashedEmailToSubmissions < ActiveRecord::Migration[7.1]
  def change
    add_column :submissions, :hashed_email, :string, null: false
  end
end
