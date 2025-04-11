class CreateSubmissions < ActiveRecord::Migration[7.1]
  def change
    create_table :submissions do |t|
      t.string :feeling
      t.string :stress
      t.text :comments

      t.timestamps
    end
  end
end
